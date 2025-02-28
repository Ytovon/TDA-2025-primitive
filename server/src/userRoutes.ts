import express, { Request, Response } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getAllUsers,
  getUserByUUID,
  updateUserByUUID,
  deleteUserByUUID,
  googleLogin,  
  googleCallback,
  forgotPassword,
  verifyToken,
  banUser,
  getGameHistoryByUUID // Import the new function
} from "./userController.js";
import { isAdminMiddleware } from './adminMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/verify-token", verifyToken);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);

// Google OAuth routes
router.get("/auth/google", googleLogin);
router.get("/auth/google/callback", googleCallback);

// Protected routes (authentication required)
router.get("", getAllUsers);
router.get("/:uuid", getUserByUUID);
router.get("/:uuid/history", getGameHistoryByUUID); // Add this line

// Admin route for banning users
router.post("/ban/:uuid", isAdminMiddleware, banUser);

export { router };
