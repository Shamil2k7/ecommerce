// import mongoose from "mongoose";

// const staffSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     phone: {
//       type: String,
//       required: [true, "Phone number is required"],
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: [true, "Password is required"],
//     },

//     role: {
//       type: String,
//       enum: [
//         "Administrator",
//         "Manager",
//         "Sales", 
//         "Support",
//       ],
//       default: "Support",
//     },

//     department: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     address: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     status: {
//       type: String,
//       enum: ["Active", "Inactive"],
//       default: "Active",
//     },

//     image: {
//       type: String,
//       default: "",
//     },

//     cloudinary_id: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model("Staff", staffSchema);