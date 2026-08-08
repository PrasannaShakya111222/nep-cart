import jwt from "jsonwebtoken";
import Feedback from "../models/feedback.model.js";
import User from "../models/user.model.js";

export const submitFeedback = async (req, res) => {
	try {
		const { comment, email, rating } = req.body;

		if (!comment || !comment.trim()) {
			return res.status(400).json({ message: "Feedback comment is required" });
		}

		let userId = null;
		let userEmail = email;

		// Check if user is logged in via access token cookie
		const accessToken = req.cookies?.accessToken;
		if (accessToken) {
			try {
				const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
				const user = await User.findById(decoded.userId).select("-password");
				if (user) {
					userId = user._id;
					if (!userEmail) {
						userEmail = user.email;
					}
				}
			} catch {
				// Token verification failed or expired - submit as guest feedback
			}
		}

		const feedback = await Feedback.create({
			comment: comment.trim(),
			email: userEmail || undefined,
			rating: rating ? Number(rating) : 5,
			user: userId,
		});

		res.status(201).json({
			message: "Feedback submitted successfully",
			feedback,
		});
	} catch (error) {
		console.log("Error in submitFeedback controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllFeedbacks = async (req, res) => {
	try {
		const feedbacks = await Feedback.find()
			.populate("user", "name email")
			.sort({ createdAt: -1 });

		res.json({ feedbacks });
	} catch (error) {
		console.log("Error in getAllFeedbacks controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteFeedback = async (req, res) => {
	try {
		const { id } = req.params;
		const feedback = await Feedback.findByIdAndDelete(id);

		if (!feedback) {
			return res.status(404).json({ message: "Feedback not found" });
		}

		res.json({ message: "Feedback deleted successfully" });
	} catch (error) {
		console.log("Error in deleteFeedback controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
