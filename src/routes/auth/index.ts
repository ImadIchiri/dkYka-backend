import { Router } from "express";
import * as authController from "../../controllers/auth";

const authRoutes = Router();

// User registration & Login
authRoutes.post("/register", authController.registerUser);
authRoutes.post("/login", authController.loginUser);

// Email Verification (Clicked from the email link)
// Example: /auth/verify-email?token=...
authRoutes.get("/verify-email", authController.verifyEmail);

// Token Management
authRoutes.post("/refresh-token", authController.refreshToken);

// Request the reset link
authRoutes.post("/request-password-reset", authController.requestPasswordReset);

// The actual reset action (Used by the frontend page)
// Example: /auth/reset-password?id=...&token=...
authRoutes.post("/reset-password", authController.resetPassword);

/**
 * @description Administrative / Security Routes
 * These should ideally be protected by an 'isAuthenticated' middleware
 */
authRoutes.post("/revoke-tokens", authController.revokeTokens);

export default authRoutes;
