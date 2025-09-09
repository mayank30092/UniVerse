import express from "express";
import Event from "../models/Event.js";
import {verifyToken, isAdmin} from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/events
 * @desc    Admin creates a new event
 * @access  Admin only
 */

router.post("/", verifyToken, isAdmin, async(req,res)=>{
    try{
        const {title,description,date,venue} = req.body;
        const event = await Event.create({
            title,
            description,
            date,
            venue,
            createdBy:req.user.id,
        });

        res.status(201).json({message:"Event created successfully", event});
    }catch(error){
        res.status(500).json({message:error.message});
    }
});

/**
 * @route   GET/api/events
 * @desc    Get all events (Students & admin can view)
 * @access  Public
 */

router.get("/", async(req,res)=>{
    try{
        const events = await Event.find().populate("createdBy","name email");
        res.json(events);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

/**
 * @route GET/api/events/:id
 * @desc Get single event details
 * @access Public
 */

router.get("/:id", async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id).populate("createdBy","name email");
        if(!event) return res.status(404).json({messgae:"Event not found"});
        res.json(event);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

/**
 * @route POST/api/events/:id/register
 * @desc Student registers for an event
 * @access Student only
 */

router.post("/:id/register",verifyToken, async(req,res)=>{
    try{
        const event = await Event.findById(req.params.id);
        if(!event) return res.status(404).json({messgae:"Event not found"});

        if(event.participants.includes(req.user.id)){
            return res.status(400).json({message: "Already registered for the event"});
        }
        event.participants.push(req.user.id);
        await event.save();

        res.json({message:"Registered successfully",event});
    }catch(error){
        res.status(500).json({message:error.message})
    }
});

export default router;