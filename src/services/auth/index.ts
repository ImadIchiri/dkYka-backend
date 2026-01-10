import "dotenv/config";
import { prisma } from "../../lib/prisma";
import { hashToken } from "../../utils/hashToken";
import nodemailer from "nodemailer";

// used when we create a refresh token.
// a refresh token is valid for 30 days
// that means that if a user is inactive for more than 30 days, he will be required to log in again
export const addRefreshTokenToWhitelist = ({
  refreshToken,
  userId,
}: {
  refreshToken: string;
  userId: string;
}) => {
  return prisma.refreshToken.create({
    data: {
      hashedToken: hashToken(refreshToken),
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    },
  });
};

// used to check if the token sent by the client is in the database.
export const findRefreshToken = (token: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      hashedToken: hashToken(token),
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshTokenById = (id: string) => {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = (userId: string) => {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_AUTH_USER_EMAIL,
    pass: process.env.NODEMAILER_AUTH_PASSWORD, // crated in 'Application Passwords section on Google_Account'
  },
});

export const sendVerificationEmail = async (
  sender: string,
  recipient: string,
  refreshToken: string, // Now used for the verification link
  credentials: { email: string; password: string }
) => {
  // Construct the verification URL (pointing to your frontend or API)
  const verificationUrl = `http://localhost:${
    process.env.SERVER_PORT || 8085
  }/verify-email?token=${refreshToken}`;

  const mailOptions = {
    from: sender,
    to: recipient,
    subject: "Your Credentials & Activation - YNOV School Management",
    html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eee; border-radius: 10px;">
      
      <h2 style="color: #333; text-align: center;">Welcome to YNOV</h2>
      <p style="color: #555; font-size: 16px;">An account has been created for you. Please use the credentials below to log in after activating your account.</p>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Email:</strong> ${credentials.email}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #eee; padding: 2px 5px; border-radius: 4px;">${credentials.password}</code></p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Click the button below to verify your email and activate your account:</p>
        <a href="${verificationUrl}" style="
          background-color: #059023;
          color: white;
          padding: 14px 25px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          display: inline-block;
        ">Verify & Activate Account</a>
      </div>

      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      
      <p style="font-size: 12px; color: #999; text-align: center;">
        If you didn't expect this email, please ignore it.<br>
        <strong>Note:</strong> You will be asked to change your password upon your first login.
      </p>
    </div>`,
  };

  await emailTransporter.sendMail(mailOptions);
};

export const emailVerificationUrl = (refreshToken: string): string =>
  `http://localhost:${
    process.env.PORT || 8080
  }/api/v1/verify-email?token=${refreshToken}`;

export const sendPasswordResetEmail = async (
  email: string,
  userId: string,
  token: string
) => {
  const resetURL = `http://localhost:5173/reset-password?id=${userId}&token=${token}`;

  // Use your existing transporter logic here...
  await emailTransporter.sendMail({
    to: email,
    subject: "Reset your Password",
    html: `<p>Click <a href="${resetURL}">here</a> to reset your password. The link expires in 1 hour.</p>`,
  });
};
