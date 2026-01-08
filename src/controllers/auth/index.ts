import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import * as authService from "../../services/auth";
import * as userService from "../../services/user";
import { generateTokens, hashPassword } from "../../utils/jwt";
import { prisma } from "../../lib/prisma";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password, roleId } = req.body;

    // Check if User already exists (email)
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use.",
      });
    }

    // Check if User already exists (username)
    const existingUsername = await prisma.profile.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken." });
    }

    // check if Role exists
    if (roleId) {
      const checkRole = await prisma.role.findUnique({ where: { id: roleId } });
      if (!checkRole) {
        return res.status(404).json({
          success: false,
          message: `No Role Found With Id ${roleId}`,
        });
      }
    }

    // Create User and Profile using a Nested Write
    const newUser = await userService.createUser({
      email,
      password: await hashPassword(password),
      roleId,
      profile: {
        create: {
          username,
          fullName,
        },
      },
    });

    // Generate Tokens
    // newUser already includes role/profile because of our service logic
    const { accessToken, refreshToken } = generateTokens({
      id: newUser.id,
      role: {
        id: newUser.roleId,
        name: newUser.role?.name,
      },
    });

    // Security & Whitelisting
    await authService.addRefreshTokenToWhitelist({
      refreshToken,
      userId: newUser.id,
    });

    // Send the Verification Email
    // We send the RAW tempPassword so the user can log in for the first time
    await authService.sendVerificationEmail(
      process.env.NODEMAILER_AUTH_USER_EMAIL as string,
      newUser.email,
      refreshToken,
      { email, password }
    );

    return res.status(201).json({
      success: true,
      data: newUser,
      message: `User created successfully. Please check your email for your temporary password!`,
    });
  } catch (error: any) {
    console.error("Error in createUser:", error);
    // Check if it's a Prisma unique constraint error
    if (error?.code === "P2002") {
      return res
        .status(400)
        .json({ success: false, message: "Username or Email already exists" });
    }
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal Server Error While Creating User",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "You must provide an email and a password.",
      });
    }

    // 'getUserByEmail' does not return the password so we will use thi method directly
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.password) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid login credentials." });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid login credentials." });
    }

    // Check If Email verified or not yet
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user.id,
      role: { id: user.role?.id || null, name: user.role?.name },
    });

    await authService.addRefreshTokenToWhitelist({
      refreshToken,
      userId: user.id,
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
      success: true,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error while Login",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token found!" });
    }

    const savedToken = await authService.findRefreshToken(token as string);

    if (!savedToken) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Or Outdated Token" });
    }

    // Update 'isEmailVerified'
    await prisma.user.update({
      where: { id: savedToken.userId },
      data: { isEmailVerified: true },
    });

    res
      .status(200)
      .json({ success: true, message: "Your account is activated now." });
  } catch (error) {
    res.status(500).json({ message: "Error while verifying email", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Missing refresh token." });
    }

    const savedRefreshToken = await authService.findRefreshToken(refreshToken);

    // Note: your schema uses expiresAt (camelCase)
    if (
      !savedRefreshToken ||
      savedRefreshToken.revoked === true ||
      Date.now() >= savedRefreshToken.expiresAt.getTime()
    ) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userService.getUserById(savedRefreshToken.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await authService.deleteRefreshTokenById(savedRefreshToken.id);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: user.id,
      role: { id: user.roleId as string, name: user.role?.name },
    });

    await authService.addRefreshTokenToWhitelist({
      refreshToken: newRefreshToken,
      userId: user.id,
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error while Refreshing Token",
    });
  }
};

export const revokeTokens = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // userId is now a string (UUID)

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId." });
    }

    await authService.revokeTokens(userId);
    res.json({ message: `Tokens revoked for user with id #${userId}` });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error while Revoking Tokens",
    });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await userService.getUserByEmail(email);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "1h" }
    );

    const resetURL = `http://localhost:${
      process.env.PORT || 8088
    }/api/v1/resetpassword?id=${user.id}&token=${token}`;

    const transporter = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE,
      auth: {
        user: process.env.NODEMAILER_AUTH_USER_EMAIL,
        pass: process.env.NODEMAILER_AUTH_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.NODEMAILER_AUTH_USER_EMAIL,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetURL}`,
    });

    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { id, token } = req.query; // id is UUID string
  const { password } = req.body;

  try {
    if (!id || !token) {
      return res
        .status(400)
        .json({ success: false, message: "User Id and token are missing!" });
    }

    const user = await userService.getUserById(id as string);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist!" });
    }

    const verify = jwt.verify(
      token as string,
      process.env.JWT_ACCESS_SECRET as string
    ) as { id: string; email: string };

    if (id !== verify.id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token data!" });
    }

    const encryptedPassword = await hashPassword(password);

    await userService.updateUser({
      id: id as string,
      password: encryptedPassword,
    });

    res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error resetting password" });
  }
};
