import express from "express";

import {
  getContact,
  updateContact,
  sendMessage,
  getMessages,
  getSingleMessage,
  updateMessageStatus,
  replyMessage,
  deleteMessage,
} from "../controllers/contact/contact.controller.js";

import protect from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.get("/", getContact);
router.post("/message", sendMessage);

// Admin
router.put("/", protect, isAdmin, updateContact);

router.get("/messages", protect, isAdmin, getMessages);
router.get("/messages/:id", protect, isAdmin, getSingleMessage);

router.put(
  "/messages/:id/status",
  protect,
  isAdmin,
  updateMessageStatus
);

router.put(
  "/messages/:id/reply",
  protect,
  isAdmin,
  replyMessage
);

router.delete(
  "/messages/:id",
  protect,
  isAdmin,
  deleteMessage
);
router.delete(
  "/messages/:id",
  protect,
  
  deleteMessage
);

export default router;