import { Router } from "express";
import * as authController from "../../controllers/auth";

const authRouter = Router();

// User registration & Login
authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.loginUser);

// Email Verification (Clicked from the email link)
// Example: /auth/verify-email?token=...
authRouter.get("/verify-email", authController.verifyEmail);

// Token Management
authRouter.post("/refresh-token", authController.refreshToken);

// Request the reset link
authRouter.post("/request-password-reset", authController.requestPasswordReset);

// The actual reset action (Used by the frontend page)
// Example: /auth/reset-password?id=...&token=...
authRouter.post("/reset-password", authController.resetPassword);

/**
 * @description Administrative / Security Routes
 * These should ideally be protected by an 'isAuthenticated' middleware
 */
authRouter.post("/revoke-tokens", authController.revokeTokens);

export default authRouter;
