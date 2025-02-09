import express from "express";
import { register, login, refreshToken, logout } from "./userController";
const router = express.Router();
// Public routes (no authentication required)
router.post("/register", (req, res) => register(req, res));
router.post("/login", (req, res) => login(req, res));
router.post("/refresh-token", (req, res) => refreshToken(req, res));
router.post("/logout", (req, res) => logout(req, res));
export default router;
//# sourceMappingURL=userRoutes.js.map