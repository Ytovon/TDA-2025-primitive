import { Sequelize } from "sequelize";

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_PATH || "./database.sqlite", // Path to SQLite database file
  logging: false, // Disable logging for cleaner console output
});

(async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log("Connection to the database has been established successfully.");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Unable to connect to the database:", err.message);
    } else {
      console.error("An unknown error occurred while connecting to the database.");
    }
  }
})();

export { sequelize }; // Export the Sequelize instance