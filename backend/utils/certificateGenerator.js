import { v2 as cloudinary } from "cloudinary";
import { createCanvas, loadImage } from "canvas";

// ✅ Configure Cloudinary (make sure your .env has correct values)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateAndUploadCertificate(event, participant) {
  try {
    const width = 1920;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    console.log("🖌 Drawing certificate for:", participant.name, event.title);

    // ✅ Load template (make sure path is correct relative to backend)
    const background = await loadImage("assets/templates/Certificate_template.png");
    ctx.drawImage(background, 0, 0, width, height);

    // Name
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(participant.name || "Student", width / 2, 540);

    // Event Title
    ctx.font = "bold 36px Arial";
    ctx.fillText(event.title || "Event", width-320, 613);

    // Date
    ctx.font = "30px Arial";
    ctx.fillText(`${new Date(event.date).toLocaleDateString()}`,680, 710);

    // Organizer
    ctx.font = "30px Arial";
    ctx.fillText(`${event.name || "Society"}`, width-630, 710);

    // Signatures
    ctx.textAlign = "left";
    ctx.fillText("Head of Event", 200, 950);
    ctx.textAlign = "right";
    ctx.fillText("Authorized by UniVerse", width - 200, 950);

    // ✅ Convert to buffer
    const buffer = canvas.toBuffer("image/png");
    console.log("📦 Canvas buffer size:", buffer.length);

    // ✅ Convert buffer to base64 for Cloudinary
    const base64 = `data:image/png;base64,${buffer.toString("base64")}`;

    // ✅ Upload directly to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "certificates",
      public_id: `${(participant.name || "student")
        .replace(/\s+/g, "_")}_${(event.title || "event")
        .replace(/\s+/g, "_")}_${Date.now()}`,
      overwrite: true,
    });

    console.log("✅ Cloudinary upload result:", result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error("❌ Certificate generation failed:", err);
    return null;
  }
}
