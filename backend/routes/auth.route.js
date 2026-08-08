import express from "express";
import {
	login,
	logout,
	signup,
	refreshToken,
	getProfile,
	verifyEmail,
	resendVerification,
	updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;
