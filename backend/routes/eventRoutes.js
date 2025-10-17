import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import * as eventController from "../controller/eventController.js";

const router = express.Router();

// Admin routes
router.post("/", verifyToken, authorizeRoles("admin"), upload("events").single("image"), eventController.createEvent);
router.put("/:id", verifyToken, authorizeRoles("admin"), upload("events").single("image"), eventController.updateEvent);
router.delete("/:id", verifyToken, authorizeRoles("admin"), eventController.deleteEvent);
router.get("/:id/attendance-qrcode", verifyToken, authorizeRoles("admin"), eventController.generateAttendanceQRCode);
router.post("/:id/certificates/generate", verifyToken, authorizeRoles("admin"), eventController.generateCertificates);

// Public routes
router.get("/", eventController.getAllEvents);

// Student routes
router.get("/registered", verifyToken, authorizeRoles("student"), eventController.getRegisteredEvents);
router.post("/:id/register", verifyToken, authorizeRoles("student"), eventController.registerForEvent);
router.post("/:id/attendance", verifyToken, authorizeRoles("student"), eventController.markEventAttendance);
router.post("/scan", verifyToken, authorizeRoles("student"), eventController.scanAttendanceQRCode);

router.get("/:id", eventController.getEventById);

export default router;
