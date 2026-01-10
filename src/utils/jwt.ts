import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthUser, TokenPayload } from "../types/user";

// Token Expires After '15 minutes'
export const generateAccessToken = (user: TokenPayload) => {
  // The Client will receive "PERMISIIONS LIST" and not "ROLE"
  const jwtUser: AuthUser = {
    userId: user.id,
    permissions: [...user.permissions], // ["USR-U1", "PST-A1", ...]
  };

  return jwt.sign(jwtUser, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

// Generate a random string as refreshToken
export const generateRefreshToken = (): string =>
  crypto.randomBytes(16).toString("base64url");

// Generate Tokens
type GenerateTokensType = {
  accessToken: string;
  refreshToken: string;
};

export const generateTokens = (user: TokenPayload): GenerateTokensType => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
};

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, 12);
