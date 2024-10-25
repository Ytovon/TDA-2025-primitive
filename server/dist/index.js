// src/index.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// Define __filename and __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Now you can use __dirname as before
app.use(express.static(path.join(__dirname, "client/build")));
// Serve the React app on all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
// Serve JSON response at /api
app.get("/api", (req, res) => {
    res.json({ organization: "Student Cyber Games" });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
