// backend/routes/eventRoutes.js
import express from "express";
import mongoose from "mongoose";
import QRCode from "qrcode";
import Event from "../models/Event.js";
import { verifyToken, isAdmin, isStudent } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/events
 * @desc    Admin creates a new event
 * @access  Admin only
 */
router.post("/", verifyToken, isAdmin, async (req, res) => {
  console.log("Create Event Body:", req.body);
  console.log("User:", req.user);

  try {
    const { title, description, date,time, venue,requiresAttendance } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      requiresAttendance: !!requiresAttendance,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("participants.user", "name email");

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event details
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Admin updates event
 * @access  Admin only
 */
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, description, date,time, venue,requiresAttendance } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date,time, venue,requiresAttendance: !!requiresAttendance },
      { new: true, runValidators: true }
    );

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, message: "Event updated successfully", data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Admin deletes event
 * @access  Admin only
 */
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/events/:id/register
 * @desc    Student registers for an event
 * @access  Student only
 */
router.post("/:id/register", verifyToken, isStudent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ success: false, message: "Event not found" });

    let eventDateTime = new Date(event.date);
    if (event.time) {
      const [hours, minutes] = event.time.split(":").map(Number);
      eventDateTime.setHours(hours);
      eventDateTime.setMinutes(minutes);
    }

    // Prevent registration for past events
    if (eventDateTime < new Date()) {
      return res.status(400).json({ success: false, message: "Event already passed" });
    }

    // Initialize participants array if missing
    event.participants = event.participants || [];

    // Prevent duplicate registration
    const userId = req.user.id;
    if (event.participants.some(p => p.user.toString() === userId))
      return res.status(400).json({ success: false, message: "Already registered" });

    // Push a participant object
    event.participants.push({
      user: new mongoose.Types.ObjectId(userId),
      name: req.user.name,
      email: req.user.email
    });

    await event.save();

    res.json({
      success: true,
      message: "Registered successfully",
      data: event,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/events/:id/attendance
 * @desc    Mark attendance for a student (via QR code scan)
 * @access  Student only
 */
router.post("/:id/attendance", verifyToken, isStudent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.requiresAttendance) {
      return res.status(400).json({ message: "This event does not require attendance" });
    }

    const userId = req.user.id; // ✅ From token, not from QR

    // Check if registered
    const participant = event.participants.find(
      (p) => p.user.toString() === userId
    );
    if (!participant) {
      return res.status(400).json({ message: "You are not registered for this event" });
    }

    // Prevent duplicate attendance
    if (event.attendance.some((a) => a.user.toString() === userId)) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Mark attendance
    event.attendance.push({ user: userId });
    participant.attended = true;
    await event.save();

    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



/**
 * @route   GET /api/events/:id/attendance-qrcode
 * @desc    Generate QR code for event attendance
 * @access  Admin only
 */
router.get("/:id/attendance-qrcode",verifyToken,isAdmin,async(req,res)=>{
  try {
    const event  = await Event.findById(req.params.id);
    if(!event) return res.status(404).json({ message: "Event not found" });

    if (!event.requiresAttendance) {
      return res.status(400).json({ message: "This event does not require attendance" });
    }

    const attendanceUrl =`${process.env.FRONTEND_URL}/scan-attendance/${event._id}`;

    const qrCodeDataURL = await QRCode.toDataURL(attendanceUrl);
    res.json({success:true,qrCode:qrCodeDataURL});
  } catch (error) {
      console.error("QR Code generation error:", error);
    res.status(500).json({ message: error.message });
  }
})

export default router;
