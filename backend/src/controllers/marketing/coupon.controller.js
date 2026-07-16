import Coupon from "../../models/Coupon.js";
//creat
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
      return res.status(400).send("All fields are required");
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
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

//find all
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json(coupons);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//findone
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).send("Coupon Not Found");
    }

    return res.status(200).json(coupon);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
//update
export const updateCoupon = async (req, res) => {
  try {
    console.log("Update Controller Called");
    console.log("ID :", req.params.id);
    console.log("BODY :", req.body);

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedCoupon) {
      return res.status(404).send("Coupon Not Found");
    }

    return res.status(200).json({
      message: "Coupon Updated Successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

//delete
export const deleteCoupon = async (req, res) => {
  try {
    console.log("Delete Controller Called");
    console.log("ID :", req.params.id);

    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!deletedCoupon) {
      return res.status(404).send("Coupon Not Found");
    }

    return res.status(200).json({
      message: "Coupon Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};