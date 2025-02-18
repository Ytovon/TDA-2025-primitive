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
  verifyToken, // <-- Import forgotPassword function
} from "./userController.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/verify-token", verifyToken);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword); // <-- Add forgot-password route

// Google OAuth routes
router.get("/auth/google", googleLogin);
router.get("/auth/google/callback", googleCallback);

// Protected routes (authentication required)
router.get("", getAllUsers);
router.get("/:uuid", getUserByUUID);
// router.put("/users/:uuid", updateUserByUUID);
// router.delete("/users/:uuid", deleteUserByUUID);

export { router };
