// certificateController.js
import Event from "../models/Event.js";
import { generateAndUploadCertificate } from "../utils/certificateGenerator.js"; // Step 3 function

export const generateCertificatesForEvent = async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: "Event not found" });

  for (const participant of event.participants) {
    if (participant.attended && !participant.certificateIssued) {
      const url = await generateAndUploadCertificate(event, participant);
      participant.certificateUrl = url;
      participant.certificateIssued = true;
    }
  }

  await event.save();
  res.json({ message: "Certificates generated successfully" });
};
