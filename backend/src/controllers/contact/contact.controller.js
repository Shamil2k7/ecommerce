import Contact from "../../models/contact.model.js";
import ContactMessage from "../../models/contactMessage.model.js";

/* =====================================================
   CONTACT SETTINGS
===================================================== */

// GET /api/contact
export const getContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create({
        companyName: "",
        email: "",
        phone: "",
        whatsapp: "",
        address: "",
        mapEmbed: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        workingHours: "",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/contact
export const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create(req.body);
    } else {
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Contact information updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   CONTACT MESSAGES
===================================================== */

// POST /api/contact/message
export const sendMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contactMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/contact/messages
export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/contact/messages/:id
export const getSingleMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/contact/messages/:id/status
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/contact/messages/:id/reply
export const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;

    const message = await ContactMessage.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.adminReply = reply;
    message.status = "Replied";
    message.repliedAt = new Date();

    await message.save();

    res.status(200).json({
      success: true,
      message: "Reply saved successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/contact/messages/:id
export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(
      req.params.id
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.isDeleted = true;

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};