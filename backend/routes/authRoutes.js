import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

//Register User
router.post("/register", async(req,res)=>{
    console.log("Register hit:", req.body); 
    try{
        const {name,email,password,role} = req.body;

        //Check if user already exists
        const exists = await User.findOne({email});
        if(exists) return res.status(400).json({message:"User already exists"});

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);//bcrypt.hash() method given by bcrypt for salting

        //craete user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({message:"User registered successfully"});
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

//Login User
router.post("/login",async(req,res)=>{
    try{
        const {email,password} = req.body;

        //find User
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"});

        //check password
        const isMatch = await bcrypt.compare(password,user.password);//bcrypt.compare() method to compare previously hashed password's plain text with current password
        if(!isMatch)
            return res.status(400).json({message:"Invalid Credentials"});

        //create JWT Token
        //!
        const token =jwt.sign(
            {
            id: user._id,
            role:user.role,
            name:user.name,
            email:user.email,
        },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        res.json({token,role:user.role,name:user.name});
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

export default router;