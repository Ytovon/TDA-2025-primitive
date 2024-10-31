// src/index.ts
import express from "express";
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

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
