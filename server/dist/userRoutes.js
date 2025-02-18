import express from "express";
import { register, login, refreshToken, logout, getAllUsers, getUserByUUID, updateUserByUUID, deleteUserByUUID, verifyToken, } from "./userController.js";
const router = express.Router();
// Public routes (no authentication required)
router.post("/register", (req, res) => {
    register(req, res).catch((err) => {
        console.error("Error in register route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/login", (req, res) => {
    login(req, res).catch((err) => {
        console.error("Error in login route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/refresh-token", (req, res) => {
    refreshToken(req, res).catch((err) => {
        console.error("Error in refreshToken route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/logout", (req, res) => {
    logout(req, res).catch((err) => {
        console.error("Error in logout route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.post("/verify-token", (req, res) => {
    verifyToken(req, res).catch((err) => {
        console.error("Error in verifyToken route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
// Protected routes (authentication required)
router.get("/", (req, res) => {
    getAllUsers(req, res).catch((err) => {
        console.error("Error in getAllUsers route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.get("/:uuid", (req, res) => {
    getUserByUUID(req, res).catch((err) => {
        console.error("Error in getUserByUUID route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.put("/:uuid", (req, res) => {
    updateUserByUUID(req, res).catch((err) => {
        console.error("Error in updateUserByUUID route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
router.delete("/:uuid", (req, res) => {
    deleteUserByUUID(req, res).catch((err) => {
        console.error("Error in deleteUserByUUID route:", err);
        res.status(500).json({ message: "Internal server error." });
    });
});
export default router;
//# sourceMappingURL=userRoutes.js.map