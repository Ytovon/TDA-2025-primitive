const express = require("express");
const gameRoutes = require("./routes");
const { sequelize } = require("./models"); // Import Sequelize instance

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
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
