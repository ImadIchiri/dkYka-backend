import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  id: string;
  role?: {
    id: string | null;
    name?: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "🚫 Unauthorized" });
  }

  //  MAINTENANT token EST FORCÉMENT string
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "🚫 Unauthorized" });
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as unknown as AuthPayload;

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.auth = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Token expired"
          : "🚫 Unauthorized",
    });
  }
};
