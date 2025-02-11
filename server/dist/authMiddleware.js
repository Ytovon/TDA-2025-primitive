import jwt from "jsonwebtoken";
import { User } from "./models.js";
// Secret keys
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";
// Middleware to verify access token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: "Access token is required." });
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                return await refreshToken(req, res, next); // Attempt to refresh token
            }
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = decoded; // Attach user data to request
        next();
    });
};
// Function to refresh the access token
const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers["x-refresh-token"]; // Get refresh token from headers
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token is required." });
        }
        const user = await User.findOne({ where: { refreshToken } }); // Cast to any to avoid type issues
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }
        // Verify refresh token
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token." });
            }
            // Generate a new access token
            const newAccessToken = jwt.sign({ uuid: user.uuid, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
            res.setHeader("x-new-access-token", newAccessToken); // Send new token in headers
            req.user = decoded; // Attach user data
            next();
        });
    }
    catch (err) {
        console.error("Error refreshing token:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};
export { authenticateToken };
//# sourceMappingURL=authMiddleware.js.map