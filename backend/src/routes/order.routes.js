import express from "express";
import { approveRefund, createOrder, deleteOrder, getAllOrders, getOrderCounts, getRefundRequests, getSingleOrder, rejectRefund, requestRefund, updateOrderStatus, updatePaymentStatus } from "../controllers/order/order.controller.js";




const router = express.Router();

// Create Order

export default router;

// Orders
router.post("/create", createOrder);
router.get("/", getAllOrders);
router.get("/counts", getOrderCounts);
router.get("/:id", getSingleOrder);
router.put("/:id", updateOrderStatus);
router.put("/:id/payment", updatePaymentStatus);
router.delete("/:id", deleteOrder);

// Refund
router.get("/refunds", getRefundRequests);

router.put("/:id/request-refund", requestRefund);

router.put("/:id/approve-refund", approveRefund);

router.put("/:id/reject-refund", rejectRefund);