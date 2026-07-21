import express from "express";
import { approveRefund, createOrder, deleteOrder, getAllOrders, getOrderCounts, getRefundRequests, getSingleOrder, rejectRefund, requestRefund, updateOrderStatus, updatePaymentStatus } from "../controllers/order/order.controller.js";




import protect from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

// Create Order

export default router;

// Orders
router.post("/create", protect, createOrder);
router.get("/", protect, isAdmin, getAllOrders);
router.get("/counts", protect, isAdmin, getOrderCounts);
router.get("/:id", protect, getSingleOrder);
router.put("/:id", protect, isAdmin, updateOrderStatus);
router.put("/:id/payment", protect, isAdmin, updatePaymentStatus);
router.delete("/:id", protect, isAdmin, deleteOrder);

// Refund
router.get("/refunds", protect, isAdmin, getRefundRequests);

router.put("/:id/request-refund", protect, requestRefund);

router.put("/:id/approve-refund", protect, isAdmin, approveRefund);

router.put("/:id/reject-refund", protect, isAdmin, rejectRefund);