import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: [true, "Feedback comment is required"],
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			default: 5,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
