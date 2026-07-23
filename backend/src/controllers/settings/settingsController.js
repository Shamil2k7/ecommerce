import cloudinary from "../../config/cloudinary.js";
import Settings from "../../models/Settings.js";

// ======================================
// Get Site Settings
// ======================================

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Site Settings
// ======================================

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const {
      storeName,
      tagline,
      email,
      phone,
      address,
      facebook,
      instagram,
      twitter,
      youtube,
    } = req.body;

    if (storeName !== undefined) settings.storeName = storeName;
    if (tagline !== undefined) settings.tagline = tagline;

    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (address !== undefined) settings.address = address;

    if (facebook !== undefined) settings.facebook = facebook;
    if (instagram !== undefined) settings.instagram = instagram;
    if (twitter !== undefined) settings.twitter = twitter;
    if (youtube !== undefined) settings.youtube = youtube;

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Upload Logo
// ======================================

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload logo",
      });
    }

  const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "settings/logo",
});

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    settings.logo = result.secure_url;

    await settings.save();

    res.status(200).json({
      success: true,
      logo: result.secure_url,
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Upload Favicon
// ======================================

export const uploadFavicon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload favicon",
      });
    }

   const result = await cloudinary.uploader.upload(req.file.path, {
  folder: "settings/favicon",
});
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    settings.favicon = result.secure_url;

    await settings.save();

    res.status(200).json({
      success: true,
      favicon: result.secure_url,
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// remove Favicon

export const removeFavicon = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    if (settings.favicon) {
      try {
        const publicId = settings.favicon
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Cloudinary delete failed:", err.message);
      }

      settings.favicon = "";
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: "Favicon removed successfully",
      settings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// remove Logo

export const removeLogo = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(200).json({
        success: true,
        message: "Settings not found",
      });
    }

    if (settings.logo) {
      // delete from cloudinary if needed

      settings.logo = "";
      await settings.save();
    }

    return res.status(200).json({
      success: true,
      message: "Logo removed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};