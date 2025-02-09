import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import http from "http";
import initializeWebSocket from "./websocket"; // Import WebSocket initialization
import { router as gameRoutes } from "./routes";
import userRoutes from "./userRoutes";
import { sequelize } from "./database";

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Initialize WebSocket server
initializeWebSocket(server);

const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || "http://localhost:3000";

// Use CORS middleware
app.use(cors({
  origin: ALLOWED_ORIGINS.split(","),
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Middleware
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/v1/games", gameRoutes); // Game endpoints
app.use("/api/users", userRoutes); // User endpoints

// Database sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync(); // Sync models
    console.log("Database synced.");
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

// Start server with database sync
sequelize
  .sync() // Sync database tables (creates them if they don't exist)
  .then(() => {
    console.log("Database synchronized successfully.");
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("Error syncing database:", err.message);
  });

// Define filename and dirname for ES module scope
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Serve static files from React app build directory
app.use(express.static(path.join(dirname, "../../client/build")));

// Serve the React app on all other routes
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(dirname, "../..", "client", "build", "index.html"));
});

// Global error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

export { gameRoutes };