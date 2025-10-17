import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- API Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running..." });
});

// ---------------- Serve Frontend ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// React Router fallback for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
