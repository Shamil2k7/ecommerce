import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

cloudinary.api.ping()
  .then(result => console.log("Cloudinary Connected:", result))
  .catch(error => console.error("Connection Failed:", error));

export default cloudinary;