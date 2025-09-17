// backend/routes/eventRoutes.js
import express from "express";
import mongoose from "mongoose";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import Event from "../models/Event.js";
import { verifyToken, isAdmin, isStudent } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../middleware/cloudinaryConfig.js";

const router = express.Router();

/**
 * Helper function to mark attendance
 */
async function markAttendance(eventId, userId) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const participant = event.participants.find(p => p.user.toString() === userId);
  if (!participant) throw new Error("Not registered for this event");

  if (event.attendance.some(a => a.user.toString() === userId)) {
    throw new Error("Attendance already marked");
  }

  event.attendance.push({ user: userId });
  participant.attended = true;
  await event.save();
  return event;
}

/**
 * @route   POST /api/events
 * @desc    Admin creates a new event
 * @access  Admin only
 */
router.post("/", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, time, venue, requiresAttendance } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      requiresAttendance: !!requiresAttendance,
      createdBy: req.user.id,
      image: req.file?.path, // Cloudinary URL
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
      return res.status(404).json({ success: false, message: "Event not found" });

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
router.put("/:id", verifyToken, isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, time, venue, requiresAttendance } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // If a new image is uploaded, delete the old one from Cloudinary (optional)
    if (req.file && event.image) {
      // Extract public_id from URL
      const publicId = event.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`events/${publicId}`);
      event.image = req.file.path;
    }

    // Update other fields
    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.time = time ?? event.time;
    event.venue = venue ?? event.venue;
    event.requiresAttendance = requiresAttendance !== undefined ? !!requiresAttendance : event.requiresAttendance;

    await event.save();

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
      return res.status(404).json({ success: false, message: "Event not found" });

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
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    let eventDateTime = new Date(event.date);
    if (event.time) {
      const [hours, minutes] = event.time.split(":").map(Number);
      eventDateTime.setHours(hours, minutes);
    }

    if (eventDateTime < new Date())
      return res.status(400).json({ success: false, message: "Event already passed" });

    event.participants = event.participants || [];
    const userId = req.user.id;
    if (event.participants.some(p => p.user.toString() === userId))
      return res.status(400).json({ success: false, message: "Already registered" });

    event.participants.push({
      user: new mongoose.Types.ObjectId(userId),
      name: req.user.name,
      email: req.user.email
    });

    await event.save();

    res.json({ success: true, message: "Registered successfully", data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/events/:id/attendance
 * @desc    Mark attendance for a student
 * @access  Student only
 */
router.post("/:id/attendance", verifyToken, isStudent, async (req, res) => {
  try {
    const event = await markAttendance(req.params.id, req.user.id);
    res.json({ success: true, message: "Attendance marked successfully", data: event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   GET /api/events/:id/attendance-qrcode
 * @desc    Generate QR code for event attendance
 * @access  Admin only
 */
router.get("/:id/attendance-qrcode", verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!event.requiresAttendance) return res.status(400).json({ message: "This event does not require attendance" });

    const qrToken = jwt.sign({ eventId: event._id }, process.env.JWT_SECRET, { expiresIn: "10m" });
    const attendanceUrl = `${process.env.FRONTEND_URL}/scan-attendance/${event._id}`;
    const qrCodeDataURL = await QRCode.toDataURL(attendanceUrl);

    res.json({ success: true, qrCode: qrCodeDataURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/attendance/scan
 * @desc    Verify QR token and mark attendance
 * @access  Student only
 */
router.post("/scan", verifyToken, isStudent, async (req, res) => {
  try {
    const { qrToken } = req.body;
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    const event = await markAttendance(decoded.eventId, req.user.id);
    res.json({ success: true, message: "Attendance marked successfully", data: event });
  } catch (error) {
    res.status(400).json({ message: error.message || "Invalid or expired QR code" });
  }
});

export default router;
