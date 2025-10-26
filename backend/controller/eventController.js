import mongoose from "mongoose";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";
import { generateAndUploadCertificate } from "../utils/certificateGenerator.js";


export async function markAttendance(eventId, userId) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  const participant = event.participants.find(p => p.user.toString() === userId);
  if (!participant) throw new Error("Not registered for this event");

  if (event.attendance.some(a => a.user.toString() === userId)) {
    throw new Error("Attendance already marked");
  }

  participant.attended = true;
  participant.certificateIssued = false;
  event.attendance.push({ user: userId });
  await event.save();
  return event;
}

// Create event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, requiresAttendance } = req.body;
    if (!title || !date || !venue) {
      return res.status(400).json({ message: "Title, date, and venue are required" });
    }

    // FIX: Properly handle the string "false" from FormData
    const requiresAttendanceBool = requiresAttendance === 'true' || requiresAttendance === true;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      requiresAttendance: requiresAttendanceBool, // Use the properly converted boolean
      createdBy: req.user._id,
      image: req.file?.path,
    });

    res.status(201).json({ success: true, message: "Event created successfully", data: event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("participants.user", "name email");

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get registered events for student - SIMPLE FIXED VERSION
export const getRegisteredEvents = async (req, res) => {
  try {
    if (!req.user?._id) return res.status(400).json({ success: false, message: "User ID missing" });
    
    const userId = req.user._id;
    
    console.log("🔍 GET REGISTERED EVENTS DEBUG:");
    console.log("User ID:", userId);

    const events = await Event.find({
      "participants.user": new mongoose.Types.ObjectId(userId)
    })
    .sort({ date: -1 })
    .populate("participants.user", "name email")
    .lean();

    console.log(`✅ Found ${events.length} events for user ${userId}`);
    
    // Remove the problematic debug code that causes the error
    // Just return the events without additional processing

    res.json({ success: true, data: events });
  } catch (err) {
    console.error("❌ Error in /registered route:", err);
    res.status(500).json({ success: false, message: "Failed to fetch registered events" });
  }
};

// Get single event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, requiresAttendance } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this event" });
    }

    if (req.file && event.image) {
      const publicId = event.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`events/${publicId}`);
      event.image = req.file.path;
    }

    // FIX: Properly handle the string "false" from FormData
    const requiresAttendanceBool = requiresAttendance === 'true' || requiresAttendance === true;

    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.time = time && time.trim() !== "" ? time : event.time || "10:00 AM";
    event.venue = venue ?? event.venue;
    event.requiresAttendance = requiresAttendanceBool;

    await event.save();
    res.json({ success: true, message: "Event updated successfully", data: event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ success: true, message: "Event deleted successfully" });

  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Register student for event - with time consideration
export const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    // ✅ CHECK: Prevent registration for past events (includes time)
    const eventDateTime = new Date(event.date);
    const currentDateTime = new Date();
    
    if (eventDateTime < currentDateTime) {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot register for past events. This event has already occurred." 
      });
    }

    event.participants = event.participants || [];

    const alreadyRegistered = event.participants.some(p => p.user.toString() === userId);
    if (alreadyRegistered)
      return res.status(400).json({ success: false, message: "You have already registered for this event." });

    const participant = {
      user: new mongoose.Types.ObjectId(userId),
      name: req.user.name,
      email: req.user.email,
      attended: false,
      certificateIssued: false,
    };

    event.participants.push(participant);
    await event.save();

    // Verify the registration worked
    const updatedEvent = await Event.findById(eventId);
    const newParticipant = updatedEvent.participants.find(p => p.user.toString() === userId.toString());
    console.log("✅ Registration verified:", !!newParticipant);
    console.log("📊 Total participants now:", updatedEvent.participants.length);

    // Return only the participant instead of full event
    res.json({ success: true, message: "Registered successfully", data: participant });
  } catch (error) {
    console.error("Register event error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark attendance
export const markEventAttendance = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId))
      throw new Error("Invalid event ID");

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const participant = event.participants.find(p => p.user.toString() === userId);
    if (!participant)
      return res.status(403).json({ success: false, message: "User not registered for this event" });

    if (participant.attended)
      return res.status(400).json({ success: false, message: "Attendance already marked" });

    participant.attended = true;
    await event.save();
    res.json({ success: true, message: "Attendance marked successfully", data: event });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Generate attendance QR code
export const generateAttendanceQRCode = async (req, res) => {
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
};

// Scan QR and mark attendance
export const scanAttendanceQRCode = async (req, res) => {
  try {
    const { qrToken } = req.body;
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    const event = await markAttendance(decoded.eventId, req.user.id);
    res.json({ success: true, message: "Attendance marked successfully", data: event });
  } catch (error) {
    res.status(400).json({ message: error.message || "Invalid or expired QR code" });
  }
};

// Generate certificates
export const generateCertificates = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    for (const participant of event.participants) {
      const url = await generateAndUploadCertificate(event, participant);
      if (url) {
        participant.certificateUrl = url;
        participant.certificateIssued = true;
      }
    }

    await event.save();
    const updatedEvent = await Event.findById(event._id)
      .populate({ path: "participants.user", select: "name email" });

    res.json({ success: true, data: updatedEvent, message: "Certificates generated successfully" });
  } catch (err) {
    console.error("Certificate generation error:", err);
    res.status(500).json({ success: false, message: "Failed to generate certificates" });
  }
};
