import express from "express";
import dotenv from "dotenv";//for credentials
dotenv.config();

import cors from "cors";//tells the browser which origins are allowed to access backend API
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";//authorization
import eventRoutes from "./routes/eventRoutes.js";//event routes
import path from "path";
import {fileURLToPath} from "url";

connectDB(); 

const app = express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("UniVerse API is running...");
});

app.use("/api/auth",authRoutes);
app.use("/api/events", eventRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req, res,next) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});
const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});  