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
      default: "",
    },
  },
  { _id: false }
);

const statSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
      default: 0,
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

    role: {
      type: String,
      required: true,
      trim: true,
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
    heroTitle: {
      type: String,
      default: "",
    },

    heroSubtitle: {
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

    story: {
      type: String,
      default: "",
    },

    missionTitle: {
      type: String,
      default: "Our Mission",
    },

    mission: {
      type: String,
      default: "",
    },

    visionTitle: {
      type: String,
      default: "Our Vision",
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