import Address from "../../models/Address.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { label, text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Address details are required" });
    }

    const newAddress = new Address({
      userId: req.user._id,
      label: label || "Home",
      text,
    });

    await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address saved successfully",
      address: newAddress,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, text } = req.body;

    const address = await Address.findOne({ _id: id, userId: req.user._id });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found or unauthorized" });
    }

    if (label) address.label = label;
    if (text) address.text = text;

    await address.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found or unauthorized" });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
