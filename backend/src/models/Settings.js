import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "ShopAura",
    },

    tagline: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    youtube: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Settings", settingsSchema);