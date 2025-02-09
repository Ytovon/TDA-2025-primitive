import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User } from "./models"; // Import the User model
// Secret keys (Replace with environment variables in production)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";
const SALT_ROUNDS = 10;
// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required." });
        }
        // Check if the username or email is already taken
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email is already taken." });
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            elo: 400,
            wins: 0,
            draws: 0,
            losses: 0
        });
        return res.status(201).json({ message: "User registered successfully!" });
    }
    catch (err) {
        console.error("Error during user registration:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
// Login user (supports username OR email)
const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;
        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: "Username or email and password are required." });
        }
        // Find user by either email OR username
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }
        // Generate access token (short-lived)
        const accessToken = jwt.sign({ uuid: user.uuid, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        // Generate refresh token (long-lived)
        const refreshToken = jwt.sign({ uuid: user.uuid, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        // Save refresh token in database
        await user.update({ refreshToken: refreshToken });
        return res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
    }
    catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
// Endpoint to refresh the access token
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: "Refresh token is required." });
        }
        // Find user by refresh token
        const user = await User.findOne({ where: { refreshToken: token } });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }
        // Verify refresh token
        jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token." });
            }
            // Generate new access token
            const newAccessToken = jwt.sign({ uuid: user.uuid, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            res.json({ accessToken: newAccessToken });
        });
        return res.status(200).json({ message: "Access token refreshed successfully!" });
    }
    catch (err) {
        console.error("Error refreshing token:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
// Logout (invalidate refresh token)
const logout = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Refresh token is required." });
        }
        // Find user by refresh token
        const user = await User.findOne({ where: { refreshToken: token } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        // Remove refresh token from database
        await user.update({ refreshToken: undefined });
        return res.status(200).json({ message: "Logged out successfully." });
    }
    catch (err) {
        console.error("Error during logout:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
export { register, login, refreshToken, logout };
//# sourceMappingURL=userController.js.map