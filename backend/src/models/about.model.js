import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "⭐",
    },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    heroImage: {
      type: String,
      default: "",
    },

    storyTitle: {
      type: String,
      default: "Our Story",
    },
    storyDescription: {
      type: String,
      default: "",
    },
    storyImage: {
      type: String,
      default: "",
    },

    mission: {
      type: String,
      default: "",
    },
    vision: {
      type: String,
      default: "",
    },

    features: {
      type: [featureSchema],
      default: [],
    },

    stats: {
      type: [statSchema],
      default: [],
    },

    team: {
      type: [teamSchema],
      default: [],
    },

    gallery: {
      type: [String],
      default: [],
    },

    storeName: {
      type: String,
      default: "",
    },

    ctaTitle: {
      type: String,
      default: "",
    },
    ctaDescription: {
      type: String,
      default: "",
    },
    ctaButtonText: {
      type: String,
      default: "Shop Now",
    },
    ctaButtonLink: {
      type: String,
      default: "/products",
    },

    seoTitle: {
      type: String,
      default: "",
    },
    seoDescription: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("About", aboutSchema);