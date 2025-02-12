import express from "express";
import { register, login, refreshToken, logout } from "./userController.js";
const router = express.Router();
// Public routes (no authentication required)
router.post("/register", (req, res) => {
    register(req, res).catch(err => {
        console.error("Error in register route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/login", (req, res) => {
    login(req, res).catch(err => {
        console.error("Error in login route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/refresh-token", (req, res) => {
    refreshToken(req, res).catch(err => {
        console.error("Error in refreshToken route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/logout", (req, res) => {
    logout(req, res).catch(err => {
        console.error("Error in logout route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
export default router;
//# sourceMappingURL=userRoutes.js.map