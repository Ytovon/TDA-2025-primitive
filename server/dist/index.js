"use strict";
// // src/index.ts
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// const app = express();
// const PORT = process.env.PORT || 5000;
// // Define __filename and __dirname for ES module scope
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // Serve the React app's static files
// app.use(express.static(path.resolve(__dirname, "../..", "client", "build")));
// // Serve JSON response at /api
// app.get("/api", (req, res) => {
//   res.json({ organization: "Student Cyber Games" });
// });
// // Serve the React app on all other routes
// app.get("*", (req, res) => {
//   res.sendFile(
//     path.resolve(__dirname, "../..", "client", "build", "index.html")
//   );
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
//# sourceMappingURL=index.js.map