import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { router as gameRoutes } from "./routes.js"; // Import game routes
import { sequelize } from "./database.js"; // Import Sequelize instance
const app = express();
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
app.use("/api/v1/games", gameRoutes);
// Start server with database sync
sequelize
    .sync() // Sync database tables (creates them if they don't exist)
    .then(() => {
    console.log("Database synchronized successfully.");
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error syncing database:", err.message);
});
// Define filename and dirname for ES module scope
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
// Serve static files from React app build directory
app.use(express.static(path.join(dirname, "../../client/build")));
// Serve the React app on all other routes
app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirname, "../..", "client", "build", "index.html"));
});
// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
export { gameRoutes };
//# sourceMappingURL=app.js.map