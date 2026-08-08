import express from "express";
import {
	submitFeedback,
	getAllFeedbacks,
	deleteFeedback,
} from "../controllers/feedback.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", protectRoute, adminRoute, getAllFeedbacks);
router.delete("/:id", protectRoute, adminRoute, deleteFeedback);

export default router;
