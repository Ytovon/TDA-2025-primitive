import { Sequelize } from "sequelize";
// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite", // Path to SQLite database file
    logging: false, // Disable logging for cleaner console output
});
// Test the connection
sequelize
    .authenticate()
    .then(() => {
    console.log("Connection to the database has been established successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
});
export { sequelize }; // Export the Sequelize instance
//# sourceMappingURL=database.js.map