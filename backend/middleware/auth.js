import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req,res,next) =>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(401).json({message:"No token, authorization denied"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        return res.status(401).json({message:"Invalid or expired token"})
    }
};

export const isAdmin = (req,res,next)=>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message:"Access denied. Admins only."});
    }
    next();
};

export const isStudent = (req,res,next)=>{
    if(req.user.role !== "student"){
        return res.status(403).json({message:"Access denied. Students only."});
    }
    next();
};