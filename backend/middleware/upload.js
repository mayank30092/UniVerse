// middleware/upload.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js"; // make sure this is the correct import

// Reusable function to create Cloudinary storage for any folder
export const getCloudinaryStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      transformation: [{ width: 800, height: 600, crop: "limit" }],
    },
  });

// Upload middleware generator
export const upload = (folder) =>
  multer({
    storage: getCloudinaryStorage(folder),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    },
  });
