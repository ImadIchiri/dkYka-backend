import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as authService from "../../services/auth";
import * as userService from "../../services/user";
import jwt from "jsonwebtoken";
import { generateTokens, hashPassword } from "../../utils/jwt";
import { prisma } from "../../lib/prisma";
import { SafeUser } from "../../types/user";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password, roleId } = req.body;

    // 1) Check if User already exists (email)
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use." });
    }

    // 2) Check if Username already taken
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken." });
    }

    // 3) Verify Role existence
    if (roleId) {
      const checkRole = await prisma.role.findUnique({ where: { id: roleId } });
      if (!checkRole) {
        return res
          .status(404)
          .json({ success: false, message: `No Role Found With Id ${roleId}` });
      }
    }

    // 4) Create User and Profile (Nested Write)
    const newUser = await userService.createUser({
      email,
      password: await hashPassword(password),
      roleId,
      profile: { create: { username, fullName } },
    });

    // 5) Fetch user with permissions for the token
    const userWithPermissions = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });

    // 6) Generate Tokens (Mapping permissions to codes)
    const permissionCodes =
      userWithPermissions?.role?.permissions.map((rp) => rp.permission.code) ||
      [];
    const { accessToken, refreshToken } = generateTokens({
      id: newUser.id,
      permissions: permissionCodes,
    });

    // 7) Security Whitelisting
    await authService.addRefreshTokenToWhitelist({
      refreshToken,
      userId: newUser.id,
    });

    // 8) Send Verification Email
    await authService.sendVerificationEmail(
      process.env.NODEMAILER_AUTH_USER_EMAIL as string,
      newUser.email,
      refreshToken,
      { email, password }
    );

    return res.status(201).json({
      success: true,
      message: `User created successfully. Please check your email to verify your account!`,
    });
  } catch (error: any) {
    console.error("Error in registerUser:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1) Fetch user + Role + Permissions
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
        profile: true,
      },
    });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid login credentials." });
    }

    // 2) Strict Check for Email Verification
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // 3) Extract Permission Codes
    const permissionCodes =
      user.role?.permissions.map((rp) => rp.permission.code) || [];

    // 4) Generate Tokens with RBAC info
    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      permissions: permissionCodes,
    });

    await authService.addRefreshTokenToWhitelist({
      refreshToken,
      userId: user.id,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      roleId: user.roleId,
      profile: user.profile,
    };

    return res
      .status(200)
      .json({ accessToken, refreshToken, user: safeUser, success: true });
  } catch (err: any) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Verify Email (GET /verify-email?token=...)
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Verification token is missing." });
    }

    // Find the token in the whitelist (we used the refreshToken as the verification token)
    const savedToken = await authService.findRefreshToken(token as string);

    if (!savedToken || savedToken.revoked) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    // Update user status
    await prisma.user.update({
      where: { id: savedToken.userId },
      data: { isEmailVerified: true },
    });

    // Optionally delete the token used for verification so it can't be reused
    await authService.deleteRefreshTokenById(savedToken.id);

    return res.status(200).json({
      success: true,
      message: "Account successfully activated! You can now log in.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error during email verification." });
  }
};

// Refresh Token (POST /refresh-token)
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required." });
    }

    const savedRefreshToken = await authService.findRefreshToken(refreshToken);

    // Validate token existence, revocation, and expiry
    if (
      !savedRefreshToken ||
      savedRefreshToken.revoked ||
      Date.now() >= savedRefreshToken.expiresAt.getTime()
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired refresh token.",
      });
    }

    const user = await userService.getUserById(savedRefreshToken.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    // Delete old token (Refresh Token Rotation for security)
    await authService.deleteRefreshTokenById(savedRefreshToken.id);

    // Fetch user with permissions for the new Access Token
    const userWithPerms = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    const permissionCodes =
      userWithPerms?.role?.permissions.map((rp) => rp.permission.code) || [];

    // Generate new pair
    const tokens = generateTokens({
      id: user.id,
      permissions: permissionCodes,
    });

    // Whitelist new refresh token
    await authService.addRefreshTokenToWhitelist({
      refreshToken: tokens.refreshToken,
      userId: user.id,
    });

    return res.json({ success: true, ...tokens });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during token refresh.",
    });
  }
};

// Request Password Reset (POST /request-password-reset)
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user) {
      // Security: Don't reveal if user exists. Just say "If account exists, email sent"
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: "1h",
    });

    await authService.sendPasswordResetEmail(user.email, user.id, token);

    return res
      .status(200)
      .json({ success: true, message: "Password reset link sent." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error requesting password reset." });
  }
};

// 4. Reset Password Action (POST /reset-password?id=...&token=...)
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { id, token } = req.query;
    const { password } = req.body;

    if (!id || !token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    const payload = jwt.verify(
      token as string,
      process.env.JWT_ACCESS_SECRET!
    ) as { id: string };

    if (payload.id !== id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token for this user." });
    }

    const encryptedPassword = await hashPassword(password);
    await userService.updateUser({
      id: id as string,
      password: encryptedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. You can now log in.",
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Token expired or invalid." });
  }
};

// Revoke Tokens (POST /revoke-tokens)
export const revokeTokens = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "UserId is required." });

    await authService.revokeTokens(userId);
    return res.json({
      success: true,
      message: `All sessions revoked for user ${userId}.`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Error revoking tokens." });
  }
};
