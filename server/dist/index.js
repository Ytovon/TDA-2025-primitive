// src/index.ts
import express from "express";
const app = express();
const PORT = process.env.PORT || 5000;
app.get("/hello", (req, res) => {
    res.send("Hello from Express!");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
