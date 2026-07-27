import About from "../../models/about.model.js";

// =======================================
// GET ABOUT PAGE
// GET /api/about
// =======================================
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    // Create default document if none exists
     if (!about) {
      about = await About.create({
        title: "About Our Store",
        subtitle: "Delivering quality products with trust and innovation.",
        storyTitle: "Our Story",
        storyDescription: "",
        mission: "",
        vision: "",
      });
    }

    res.status(200).json({
      success: true,
      about,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// UPDATE ABOUT PAGE
// PUT /api/about
// =======================================
export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = new About();
    }

    Object.assign(about, req.body);

    await about.save();

    res.status(200).json({
      success: true,
      message: "About page updated successfully",
      about,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// ADD FEATURE
// POST /api/about/feature
// =======================================
export const addFeature = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    about.features.push(req.body);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Feature added successfully",
      features: about.features,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// DELETE FEATURE
// DELETE /api/about/feature/:index
// =======================================
export const deleteFeature = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    about.features.splice(req.params.index, 1);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Feature deleted successfully",
      features: about.features,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// ADD STAT
// POST /api/about/stat
// =======================================
export const addStat = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    about.stats.push(req.body);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Statistic added successfully",
      stats: about.stats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// DELETE STAT
// DELETE /api/about/stat/:index
// =======================================
export const deleteStat = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    about.stats.splice(req.params.index, 1);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Statistic deleted successfully",
      stats: about.stats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// ADD TEAM MEMBER
// POST /api/about/team
// =======================================
export const addTeam = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    about.team.push(req.body);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Team member added successfully",
      team: about.team,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// DELETE TEAM MEMBER
// DELETE /api/about/team/:index
// =======================================
export const deleteTeam = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page not found",
      });
    }

    about.team.splice(req.params.index, 1);

    await about.save();

    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
      team: about.team,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.status(200).json({
    success: true,
    url: req.file.path,        // Cloudinary URL
    public_id: req.file.filename,
  });
};