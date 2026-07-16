import dotenv from "dotenv";
dotenv.config()
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

<<<<<<< HEAD
// Check Cloudinary Connection
cloudinary.api
  .ping()
  .then((result) => {
    console.log("✅ Cloudinary Connected:", result);
  })
  .catch((error) => {
    console.error("❌ Cloudinary Connection Failed:", error);
  });
=======


try {
  const result = await cloudinary.api.ping();
  console.log("Cloudinary Connected:", result);
} catch (error) {
  console.error("Cloudinary Connection Failed:", error.message);
}
>>>>>>> 809d570b30806f08a878b35b74474fa9a8c89c55

export default cloudinary;