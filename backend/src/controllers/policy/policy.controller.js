
import Policy from "../../models/Policy.js";

/* ===========================================
   Get Policies
=========================================== */

export const getPolicies = async (req, res) => {
  try {
    let policy = await Policy.findOne();

    if (!policy) {
      policy = await Policy.create({});
    }

    res.status(200).json({
      success: true,
      policy,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================================
   Update Policies
=========================================== */

export const updatePolicies = async (req, res) => {
  try {
    let policy = await Policy.findOne();

    if (!policy) {
      policy = await Policy.create({});
    }

    const {
      privacyPolicy,
      termsConditions,
      refundPolicy,
      cookiePolicy,
    } = req.body;

    if (privacyPolicy !== undefined) {
      policy.privacyPolicy = privacyPolicy;
    }

    if (termsConditions !== undefined) {
      policy.termsConditions = termsConditions;
    }

    if (refundPolicy !== undefined) {
      policy.refundPolicy = refundPolicy;
    }

    if (cookiePolicy !== undefined) {
      policy.cookiePolicy = cookiePolicy;
    }

    // Optional: Store admin ID if authentication exists
    if (req.user) {
      policy.lastUpdatedBy = req.user._id;
    }

    await policy.save();

    res.status(200).json({
      success: true,
      message: "Policies updated successfully",
      policy,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};