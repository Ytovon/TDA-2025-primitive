import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Import crypto
import { Op } from "sequelize";
import { Request, Response, NextFunction } from "express"; // Import NextFunction
import { User } from "./models.js"; // Import the User model
import { promisify } from "util";
import passport from "passport";

// Secret keys (Replace with environment variables in production)
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";
const SALT_ROUNDS = 10;

// Forgot Password
const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, SALT_ROUNDS);

    // Store token in the database with expiration time
    await user.update({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    // Generate the reset URL
    const resetURL = `https://yourfrontend.com/reset-password?token=${resetToken}&email=${email}`;

    res.status(200).json({ resetURL });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Register a new user
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res
        .status(400)
        .json({ message: "Username, email, and password are required." });
      return;
    }

    // Check if the username or email is already taken
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.status(409).json({ message: "Username or email is already taken." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      username,
      email,
      password: hashedPassword,
      elo: 400,
      wins: 0,
      draws: 0,
      losses: 0,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Login user (supports username OR email)
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res
        .status(400)
        .json({ message: "Username or email and password are required." });
      return;
    }

    // Find user and explicitly include the password field
    const user = await User.scope("withPassword").findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Check if password is valid
    if (!user.password) {
      res
        .status(500)
        .json({ message: "User password is missing in database." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password." });
      return;
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { uuid: user.uuid, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { uuid: user.uuid, username: user.username },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await user.update({ refreshToken });

    res
      .status(200)
      .json({ message: "Login successful!", accessToken, refreshToken });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const verifyTokenInRefreshToken = promisify(jwt.verify);

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(401).json({ message: "Refresh token is required." });
      return;
    }

    // Find user by refresh token
    const user = await User.findOne({ where: { refreshToken: token } });
    if (!user) {
      res.status(403).json({ message: "Invalid refresh token." });
      return;
    }

    // Verify refresh token using async/await
    try {
      await verifyTokenInRefreshToken(token);

      // Generate new access token
      const newAccessToken = jwt.sign(
        { uuid: user.uuid, username: user.username },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired refresh token." });
    }
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Logout (invalidate refresh token)
const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: "Refresh token is required." });
      return;
    }

    // Find user by refresh token
    const user = await User.findOne({ where: { refreshToken: token } });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Remove refresh token from database
    await user.update({ refreshToken: undefined });

    res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Retrieve all users
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      console.log("Token is required.");
      res.status(400).json({ message: "Token is required." });
      return;
    }

    // Verify token
    jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          console.log("Token is invalid.");
          res.status(200).json({ valid: false });
          return;
        }

        console.log("Token is valid.");
        res.status(200).json({ valid: true, uuid: decoded.uuid });
      }
    );
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Retrieve user by UUID
const getUserByUUID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;
    const user = await User.findByPk(uuid);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update user by UUID
const updateUserByUUID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;
    const { username, email, password, elo, wins, draws, losses } = req.body;

    const user = await User.findByPk(uuid);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.update({
      username,
      email,
      password: password
        ? await bcrypt.hash(password, SALT_ROUNDS)
        : user.password,
      elo,
      wins,
      draws,
      losses,
    });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete user by UUID
const deleteUserByUUID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;
    const user = await User.findByPk(uuid);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Ban user by UUID
const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uuid } = req.params;

    // Find the user to be banned
    const userToBan = await User.findByPk(uuid);
    if (!userToBan) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Prevent banning an admin (optional)
    if (userToBan.isAdmin) {
      res.status(403).json({ message: "Cannot ban an admin." });
      return;
    }

    // Ban the user by setting isBanned to true
    await userToBan.update({ isBanned: true });

    res.status(200).json({ message: "User banned successfully." });
  } catch (err) {
    console.error("Error banning user:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Google OAuth login route
// Google OAuth login route
const googleLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
};

// Google OAuth callback route
const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", (err: any, user: any) => {
    if (err || !user) {
      res.status(400).json({ message: "Authentication failed." });
      return;
    }
    // Generate JWT tokens
    const accessToken = jwt.sign(
      { uuid: user.uuid, username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { uuid: user.uuid, username: user.username },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.update({ refreshToken });

    res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
  })(req, res, next);
};

export {
  register,
  login,
  refreshToken,
  logout,
  getAllUsers,
  getUserByUUID,
  updateUserByUUID,
  deleteUserByUUID,
  verifyToken,
  googleLogin,
  googleCallback,
  forgotPassword,
  banUser,
};