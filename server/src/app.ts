import express from "express";
import { router as gameRoutes } from "./routes.js"; // Correct
import { sequelize } from "./database.js"; // Import Sequelize instance
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/games", gameRoutes);
app.use(express.static(path.join(__dirname, "../..", "client", "build")));

// Start server with database sync
sequelize
  .sync() // Sync database tables (creates them if they don't exist)
  .then(() => {
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => {
      console.log("Server is running on PORT " + PORT);
    });
  })
  .catch((err: Error) => {
    console.error("Error syncing database:", err.message);
  });

// Define filename and dirname for ES module scope
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Serve the React app on all other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(dirname, "../..", "client", "build", "index.html"));
});

export { gameRoutes };
