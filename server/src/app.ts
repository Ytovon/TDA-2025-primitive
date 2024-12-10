import express from "express";
import { router as gameRoutes } from "./routes"; // Correct
import { sequelize } from "./database.ts"; // Import Sequelize instance
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/games", gameRoutes);

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

// Define __filename and __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Serve the React app on all other routes
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../..", "client", "build", "index.html")
  );
});

  export {gameRoutes};

