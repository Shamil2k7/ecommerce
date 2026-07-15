import Coupon from "../../models/Coupon.js";

// ================= CREATE COUPON =================
export const createCoupon = async (req, res) => {
  console.log("========== CREATE COUPON ==========");

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
      return res.status(400).send("All fields are required");
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (coupon) {
      return res.status(400).send("Coupon Already Exists");
    }

    await Coupon.create({
      name,
      code: code.toUpperCase(),
      discount: Number(discount),
      expirydate,
      minimumOrderAmount: Number(minimumOrderAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      usageLimit: Number(usageLimit) || 0,
      status,
    });

    return res.status(201).send("Coupon Added Successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// ================= GET ALL =================
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ================= GET SINGLE =================
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.json(coupon);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ================= UPDATE =================
export const updateCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.params.id, req.body);
    res.send("Coupon Updated Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ================= DELETE =================
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.send("Coupon Deleted Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
};