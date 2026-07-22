import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    privacyPolicy: {
      type: String,
      default: "",
      trim: true,
    },

    termsConditions: {
      type: String,
      default: "",
      trim: true,
    },

    refundPolicy: {
      type: String,
      default: "",
      trim: true,
    },

    cookiePolicy: {
      type: String,
      default: "",
      trim: true,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one policy document exists
policySchema.statics.getPolicy = async function () {
  let policy = await this.findOne();

  if (!policy) {
    policy = await this.create({});
  }

  return policy;
};

export default mongoose.model("Policy", policySchema);