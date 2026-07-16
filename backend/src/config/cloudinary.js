import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Check Cloudinary Connection
cloudinary.api
  .ping()
  .then((result) => {
    console.log("✅ Cloudinary Connected:", result);
  })
  .catch((error) => {
    console.error("❌ Cloudinary Connection Failed:", error);
  });

export default cloudinary;