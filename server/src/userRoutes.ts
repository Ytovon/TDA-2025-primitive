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
  verifyToken,
} from "./userController.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", (req: Request, res: Response) => {
  register(req, res).catch((err) => {
    console.error("Error in register route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/login", (req: Request, res: Response) => {
  login(req, res).catch((err) => {
    console.error("Error in login route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/refresh-token", (req: Request, res: Response) => {
  refreshToken(req, res).catch((err) => {
    console.error("Error in refreshToken route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/logout", (req: Request, res: Response) => {
  logout(req, res).catch((err) => {
    console.error("Error in logout route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/verify-token", (req: Request, res: Response) => {
  verifyToken(req, res).catch((err: any) => {
    console.error("Error in verifyToken route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

// Protected routes (authentication required)
router.get("/", (req: Request, res: Response) => {
  getAllUsers(req, res).catch((err) => {
    console.error("Error in getAllUsers route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.get("/:uuid", (req: Request, res: Response) => {
  getUserByUUID(req, res).catch((err) => {
    console.error("Error in getUserByUUID route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.put("/:uuid", (req: Request, res: Response) => {
  updateUserByUUID(req, res).catch((err) => {
    console.error("Error in updateUserByUUID route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.delete("/:uuid", (req: Request, res: Response) => {
  deleteUserByUUID(req, res).catch((err) => {
    console.error("Error in deleteUserByUUID route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

export default router;
