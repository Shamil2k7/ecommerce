import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// ==========================
// Cloudinary Storage
// ==========================
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let folder = "ecommerce/products";
    let prefix = "product";

    if (file.fieldname === "logo") {
      folder = "ecommerce/brands";
      prefix = "brand";
    } else if (file.fieldname === "image") {
      folder = "ecommerce/categories";
      prefix = "category";
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "image",
    };
  },
});

// ==========================
// File Filter
// ==========================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"), false);
  }
};

// ==========================
// Multer Upload
// ==========================
const upload = multer({
  storage: cloudinaryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

export default upload;