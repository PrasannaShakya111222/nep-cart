import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Mail, ArrowRight, RefreshCw, X, Loader, Clock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const EmailVerificationModal = () => {
	const { verificationState, setVerificationState, verifyEmail, resendVerification, loading } =
		useUserStore();
	const [code, setCode] = useState("");
	const [timeLeft, setTimeLeft] = useState(300);

	useEffect(() => {
		if (!verificationState.requiresVerification) return;

		setTimeLeft(300);
		const interval = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [verificationState.requiresVerification, verificationState.email]);

	if (!verificationState.requiresVerification) return null;

	const minutes = Math.floor(timeLeft / 60);
	const seconds = (timeLeft % 60).toString().padStart(2, "0");
	const formattedTime = `${minutes}:${seconds}`;

	const handleVerify = async (e) => {
		e.preventDefault();
		if (!code || code.trim().length !== 6) {
			return;
		}
		await verifyEmail(verificationState.email, code.trim());
	};

	const handleResend = async () => {
		await resendVerification(verificationState.email);
		setTimeLeft(300);
		setCode("");
	};

	const handleClose = () => {
		setVerificationState({ requiresVerification: false, email: "" });
	};

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 20 }}
					className="
						w-full max-w-md
						bg-white dark:bg-gray-900
						border border-gray-200 dark:border-emerald-800/60
						rounded-2xl shadow-2xl
						p-6 relative overflow-hidden
					"
				>
					<button
						onClick={handleClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
					>
						<X size={20} />
					</button>

					<div className="flex justify-center mb-4">
						<div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
							<ShieldCheck size={36} />
						</div>
					</div>

					<h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
						Verify Your Email
					</h2>

					<p className="text-sm text-center text-gray-600 dark:text-slate-400 mb-4 flex items-center justify-center gap-1">
						<Mail size={16} /> Code sent to{" "}
						<span className="font-semibold text-emerald-600 dark:text-emerald-400">
							{verificationState.email}
						</span>
					</p>

					{/* 5-MINUTE EXPIRATION COUNTDOWN TIMER */}
					<div
						className={`mb-5 p-3 rounded-xl border text-xs text-center flex items-center justify-center gap-2 font-medium ${
							timeLeft > 0
								? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
								: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
						}`}
					>
						<Clock size={16} className={timeLeft > 0 ? "animate-pulse" : ""} />
						{timeLeft > 0 ? (
							<span>
								Code expires in <strong className="font-mono text-sm">{formattedTime}</strong> (5 minutes validity)
							</span>
						) : (
							<span>Code has expired! Please click "Resend Code" below.</span>
						)}
					</div>

					<form onSubmit={handleVerify} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2 text-center">
								Enter 6-Digit Verification Code
							</label>
							<input
								type="text"
								maxLength={6}
								value={code}
								onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
								placeholder="123456"
								disabled={timeLeft === 0}
								className="
									w-full text-center text-2xl font-mono tracking-[0.5em] font-bold
									py-3 px-4 rounded-xl
									bg-gray-100 dark:bg-gray-800
									border border-gray-300 dark:border-gray-700
									text-gray-900 dark:text-white
									focus:outline-none focus:border-emerald-500
									disabled:opacity-50 transition
								"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading || code.length !== 6 || timeLeft === 0}
							className="
								w-full py-3 px-4 rounded-xl
								bg-emerald-600 hover:bg-emerald-500
								text-white font-semibold
								flex items-center justify-center gap-2
								shadow-lg shadow-emerald-500/20
								disabled:opacity-50 transition
							"
						>
							{loading ? (
								<Loader className="animate-spin" size={20} />
							) : (
								<>
									Verify & Continue <ArrowRight size={18} />
								</>
							)}
						</button>
					</form>

					<div className="mt-5 text-center">
						<button
							onClick={handleResend}
							className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center justify-center gap-1 mx-auto transition font-medium"
						>
							<RefreshCw size={14} /> Didn't receive code or expired? Resend Code
						</button>
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};

export default EmailVerificationModal;
