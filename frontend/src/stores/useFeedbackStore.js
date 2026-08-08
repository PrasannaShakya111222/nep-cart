import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useFeedbackStore = create((set) => ({
	feedbacks: [],
	loading: false,

	submitFeedback: async (feedbackData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/feedback", feedbackData);
			toast.success(res.data.message || "Thank you for your feedback!");
			set({ loading: false });
			return true;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to submit feedback");
			return false;
		}
	},

	fetchAllFeedbacks: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/feedback");
			set({ feedbacks: response.data.feedbacks, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch feedbacks");
		}
	},

	deleteFeedback: async (feedbackId) => {
		set({ loading: true });
		try {
			await axios.delete(`/feedback/${feedbackId}`);
			set((state) => ({
				feedbacks: state.feedbacks.filter((item) => item._id !== feedbackId),
				loading: false,
			}));
			toast.success("Feedback deleted successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to delete feedback");
		}
	},
}));
