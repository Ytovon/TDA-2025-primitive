import express, { Request, Response } from "express";
import { register, login, refreshToken, logout } from "./userController.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", (req: Request, res: Response) => {
  register(req, res).catch(err => {
    console.error("Error in register route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/login", (req: Request, res: Response) => {
  login(req, res).catch(err => {
    console.error("Error in login route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/refresh-token", (req: Request, res: Response) => {
  refreshToken(req, res).catch(err => {
    console.error("Error in refreshToken route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});

router.post("/logout", (req: Request, res: Response) => {
  logout(req, res).catch(err => {
    console.error("Error in logout route:", err);
    res.status(500).json({ message: "Internal server error." });
  });
});



export default router;