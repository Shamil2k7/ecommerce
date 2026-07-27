import Coupon from "../../models/Coupon.js";

// Create Coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      name,
      code,
      discount,
      expirydate,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      status,
    } = req.body;

    if (!name || !code || !discount || !expirydate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon Already Exists",
      });
    }

    const coupon = await Coupon.create({
      name,
      code: code.toUpperCase(),
      discount: Number(discount),
      expirydate,
      minimumOrderAmount: Number(minimumOrderAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      usageLimit: Number(usageLimit) || 0,
      status,
    });

    return res.status(201).json({
      message: "Coupon Added Successfully",
      coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get-All-Coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      coupons,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get CouponById
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon Not Found",
      });
    }

    return res.status(200).json({
      coupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update Coupon
export const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCoupon) {
      return res.status(404).json({
        message: "Coupon Not Found",
      });
    }

    return res.status(200).json({
      message: "Coupon Updated Successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!deletedCoupon) {
      return res.status(404).json({
        message: "Coupon Not Found",
      });
    }

    return res.status(200).json({
      message: "Coupon Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};