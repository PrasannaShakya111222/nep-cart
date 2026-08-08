import express from "express";
import { getMyOrders } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my-orders", protectRoute, getMyOrders);

export default router;
