import express from "express";
import { approveRefund, cancelOrder, createOrder, deleteOrder, getAllOrders, getMyOrders, getOrderCounts, getRefundRequests, getSingleOrder, rejectRefund, requestRefund, updateOrderStatus, updatePaymentStatus } from "../controllers/order/order.controller.js";




import protect from "../middlewares/auth.middleware.js";
import { isAdminOrStaff } from "../middlewares/role.middleware.js";

const router = express.Router();

// Create Order

export default router;

// Orders

router.get("/my-orders", protect, getMyOrders);


router.put("/:id/cancel", protect, cancelOrder);

router.post("/create", protect, createOrder);
router.get("/", protect, isAdminOrStaff, getAllOrders);
router.get("/counts", protect, isAdminOrStaff, getOrderCounts);
router.get("/:id", protect, getSingleOrder);
router.put("/:id", protect, isAdminOrStaff, updateOrderStatus);
router.put("/:id/payment", protect, isAdminOrStaff, updatePaymentStatus);
router.delete("/:id", protect, deleteOrder);

// Refund
router.get("/refunds", protect, isAdminOrStaff, getRefundRequests);

router.put("/:id/request-refund", protect, requestRefund);

router.put("/:id/approve-refund", protect, isAdminOrStaff, approveRefund);

router.put("/:id/reject-refund", protect, isAdminOrStaff, rejectRefund);