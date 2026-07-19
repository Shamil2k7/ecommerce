import multer from "multer";
import path from "path";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// ==========================
// Local Upload Folder
// ==========================
const uploadDir = path.join(process.cwd(), "src", "uploads", "products");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================
// Local Disk Storage (Backup)
// ==========================
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);

    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// ==========================
// Cloudinary Storage
// ==========================
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "ecommerce/products",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    public_id: `product-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`,
  }),
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
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// ==========================
// Multer Upload
// ==========================

// 👉 To use Cloudinary
const upload = multer({
  storage: cloudinaryStorage,

  // 👉 If you want local storage again,
  // change cloudinaryStorage to diskStorage.

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 6,
  },
});

export default upload;