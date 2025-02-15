import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Request, Response } from "express";
import { User } from "./models.js"; // Import the User model

// Secret keys (Replace with environment variables in production)
const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your-access-token-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";
const SALT_ROUNDS = 10;

// Register a new user
const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    // Check if the username or email is already taken
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      elo: 400,
      wins: 0,
      draws: 0,
      losses: 0,
    });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during user registration:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Login user (supports username OR email)
const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res
        .status(400)
        .json({ message: "Username or email and password are required." });
    }

    // Find user and explicitly include the password field
    const user = await User.scope("withPassword").findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if password is valid
    if (!user.password) {
      return res
        .status(500)
        .json({ message: "User password is missing in database." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
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

    return res
      .status(200)
      .json({ message: "Login successful!", accessToken, refreshToken });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Endpoint to refresh the access token
const refreshToken = async (req: Request, res: Response): Promise<Response> => {
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
    jwt.verify(
      token,
      REFRESH_TOKEN_SECRET,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token." });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
          { uuid: user.uuid, username: user.username },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );

    return res
      .status(200)
      .json({ message: "Access token refreshed successfully!" });
  } catch (err) {
    console.error("Error refreshing token:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Logout (invalidate refresh token)
const logout = async (req: Request, res: Response): Promise<Response> => {
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
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Retrieve all users
const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error retrieving users:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const verifyToken = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { token } = req.body;
    if (!token) {
      console.log("Token is required.");
      return res.status(400).json({ message: "Token is required." });
    }

    // Verify token
    jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
      (err: jwt.VerifyErrors | null, decoded: any) => {
        if (err) {
          console.log("Token is invalid.");
          return res.status(200).json({ valid: false });
        }

        console.log("Token is valid.");
        return res.status(200).json({ valid: true, uuid: decoded.uuid });
      }
    );
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Retrieve user by UUID
const getUserByUUID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { uuid } = req.params;
    const user = await User.findByPk(uuid);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error retrieving user:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Update user by UUID
const updateUserByUUID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { uuid } = req.params;
    const { username, email, password, elo, wins, draws, losses } = req.body;

    const user = await User.findByPk(uuid);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedUser = await user.update({
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

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete user by UUID
const deleteUserByUUID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { uuid } = req.params;
    const user = await User.findByPk(uuid);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
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
};
