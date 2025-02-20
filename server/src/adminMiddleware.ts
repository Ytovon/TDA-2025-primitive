import { Request, Response, NextFunction } from "express";
import { User } from "./models.js"; // Adjust path if needed
import jwt from "jsonwebtoken"; // Import jwt for token verification

export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract the token from the request body
    const token = req.body.token;

    // Check if the token is provided
    if (!token) {
      res.status(401).json({ message: "Unauthorized. Token missing." });
      return; // Stop execution here
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret") as { uuid: string };

    // Fetch the user from the database
    const user = await User.findByPk(decoded.uuid);

    // Check if the user exists and is an admin
    if (!user || !user.isAdmin) {
      res.status(403).json({ message: "Access denied. Admins only." });
      return; // Stop execution here
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next(); // <-- This is the key fix
  } catch (err) {
    console.error("Error in admin middleware:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};