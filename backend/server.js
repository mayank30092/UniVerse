import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("UniVerse API is running...");
});

app.use("/api/auth",authRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});