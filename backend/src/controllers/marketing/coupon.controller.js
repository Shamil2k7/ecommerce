const Coupon = require("../../models/Coupon");

// ================= CREATE COUPON =================
const createCoupon = async (req, res) => {
  console.log("========== CREATE COUPON ==========");
  console.log("Request Body:");
  console.log(req.body);

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

    console.log("Name:", name);
    console.log("Code:", code);
    console.log("Discount:", discount);
    console.log("Expiry:", expirydate);

    if (!name || !code || !discount || !expirydate) {
      console.log("Validation Failed");
      return res.status(400).send("All fields are required");
    }

    console.log("Checking duplicate coupon...");

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    console.log("Duplicate Result:", coupon);

    if (coupon) {
      console.log("Coupon already exists");
      return res.status(400).send("Coupon Already Exists");
    }

    console.log("Creating coupon...");

    const newCoupon = await Coupon.create({
      name,
      code: code.toUpperCase(),
      discount: Number(discount),
      expirydate,
      minimumOrderAmount: Number(minimumOrderAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 0,
      usageLimit: Number(usageLimit) || 0,
      status,
    });

    console.log("Coupon Created Successfully");
    console.log(newCoupon);

    return res.status(201).send("Coupon Added Successfully");
  } catch (error) {
    console.log("========== SERVER ERROR ==========");
    console.log(error);
    console.log("Message:", error.message);
    console.log("Stack:");
    console.log(error.stack);

    return res.status(500).send(error.message);
  }
};

// ================= GET ALL =================
const getCoupons = async (req, res) => {
  try {
    console.log("Getting Coupons...");

    const coupons = await Coupon.find();

    console.log("Total Coupons:", coupons.length);

    res.json(coupons);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// ================= GET SINGLE =================
const getCouponById = async (req, res) => {
  try {
    console.log("Coupon ID:", req.params.id);

    const coupon = await Coupon.findById(req.params.id);

    console.log(coupon);

    res.json(coupon);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// ================= UPDATE =================
const updateCoupon = async (req, res) => {
  try {
    console.log("Updating Coupon:", req.params.id);
    console.log(req.body);

    await Coupon.findByIdAndUpdate(req.params.id, req.body);

    res.send("Coupon Updated Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// ================= DELETE =================
const deleteCoupon = async (req, res) => {
  try {
    console.log("Deleting Coupon:", req.params.id);

    await Coupon.findByIdAndDelete(req.params.id);

    res.send("Coupon Deleted Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};