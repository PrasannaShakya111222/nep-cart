import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, MessageSquare, User, Mail, Calendar, Loader } from "lucide-react";
import { useFeedbackStore } from "../stores/useFeedbackStore";

const FeedbackTab = () => {
	const { fetchAllFeedbacks, deleteFeedback, feedbacks, loading } = useFeedbackStore();

	useEffect(() => {
		fetchAllFeedbacks();
	}, [fetchAllFeedbacks]);

	return (
		<motion.div
			className="max-w-4xl mx-auto space-y-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<MessageSquare className="text-emerald-500" /> User Feedbacks ({feedbacks.length})
				</h2>
			</div>

			{loading && feedbacks.length === 0 ? (
				<div className="flex justify-center items-center py-12">
					<Loader className="w-8 h-8 animate-spin text-emerald-500" />
				</div>
			) : feedbacks.length === 0 ? (
				<div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
					No feedback entries submitted yet.
				</div>
			) : (
				<div className="grid gap-4">
					{feedbacks.map((item) => {
						const dateFormatted = new Date(item.createdAt).toLocaleString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						});

						const userName = item.user?.name || "Guest User";
						const userEmail = item.user?.email || item.email || "No email provided";

						return (
							<div
								key={item._id}
								className="
									bg-white
									dark:bg-gray-800
									border
									border-gray-200
									dark:border-gray-700
									rounded-xl
									p-5
									shadow-sm
									hover:shadow-md
									transition
									flex
									flex-col
									md:flex-row
									md:items-center
									justify-between
									gap-4
								"
							>
								<div className="space-y-2 flex-1">
									<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
										<span className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
											<User className="w-4 h-4 text-emerald-500" /> {userName}
										</span>

										<span className="flex items-center gap-1 text-gray-500">
											<Mail className="w-4 h-4" /> {userEmail}
										</span>

										<span className="flex items-center gap-1 text-gray-500">
											<Calendar className="w-4 h-4" /> {dateFormatted}
										</span>
									</div>

									<p className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
										"{item.comment}"
									</p>
								</div>

								<button
									onClick={() => deleteFeedback(item._id)}
									className="
										p-2.5
										text-red-500
										hover:text-red-700
										hover:bg-red-50
										dark:hover:bg-red-950/40
										rounded-lg
										transition
										self-end
										md:self-center
									"
									title="Delete Feedback"
								>
									<Trash className="w-5 h-5" />
								</button>
							</div>
						);
					})}
				</div>
			)}
		</motion.div>
	);
};

export default FeedbackTab;
