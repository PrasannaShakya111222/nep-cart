import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Phone,
	ShieldCheck,
	ShoppingBag,
	Edit3,
	Save,
	X,
	Calendar,
	DollarSign,
	Package,
	Loader,
} from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
	const { user, updateProfile, loading: userLoading } = useUserStore();

	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(user?.name || "");
	const [phone, setPhone] = useState(user?.phone || "");
	const [email, setEmail] = useState(user?.email || "");

	const [orders, setOrders] = useState([]);
	const [ordersLoading, setOrdersLoading] = useState(true);

	useEffect(() => {
		if (user) {
			setName(user.name || "");
			setPhone(user.phone || "");
			setEmail(user.email || "");
		}
	}, [user]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await axios.get("/orders/my-orders");
				setOrders(res.data.orders || []);
			} catch (err) {
				console.log("Error fetching user orders:", err);
				toast.error("Failed to load purchase history");
			} finally {
				setOrdersLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const handleSaveProfile = async (e) => {
		e.preventDefault();
		const success = await updateProfile({ name, phone, email });
		if (success) {
			setEditing(false);
		}
	};

	return (
		<div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-10">
			{/* PROFILE HEADER CARD */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="
					bg-white dark:bg-gray-900
					border border-gray-200 dark:border-emerald-800/50
					rounded-2xl p-6 md:p-8 shadow-xl
					flex flex-col md:flex-row items-start md:items-center justify-between gap-6
				"
			>
				<div className="flex items-center gap-5">
					<div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl font-bold border-2 border-emerald-500">
						{user?.name ? user.name.charAt(0).toUpperCase() : "U"}
					</div>

					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
								{user?.name}
							</h1>
							<span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 capitalize">
								{user?.role || "Customer"}
							</span>
						</div>

						<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
							<Mail size={14} /> {user?.email}
						</p>

						<div className="flex items-center gap-2 pt-1 text-xs">
							<span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
								<ShieldCheck size={14} /> Account Verified
							</span>
						</div>
					</div>
				</div>

				{!editing ? (
					<button
						onClick={() => setEditing(true)}
						className="
							flex items-center gap-2 px-5 py-2.5 rounded-xl
							bg-emerald-600 hover:bg-emerald-500 text-white font-medium
							transition shadow-lg shadow-emerald-500/20
						"
					>
						<Edit3 size={18} /> Edit Profile
					</button>
				) : (
					<button
						onClick={() => setEditing(false)}
						className="
							flex items-center gap-2 px-4 py-2 rounded-xl
							bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300
							hover:bg-gray-300 dark:hover:bg-gray-700 transition
						"
					>
						<X size={18} /> Cancel
					</button>
				)}
			</motion.div>

			{/* EDIT PROFILE FORM */}
			{editing && (
				<motion.form
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					exit={{ opacity: 0, height: 0 }}
					onSubmit={handleSaveProfile}
					className="
						bg-white dark:bg-gray-900
						border border-emerald-500/40
						rounded-2xl p-6 md:p-8 shadow-lg space-y-6
					"
				>
					<h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<User className="text-emerald-500" /> Update Account Details
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
								Full Name
							</label>
							<div className="relative">
								<User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="
										w-full pl-10 pr-4 py-2.5 rounded-xl
										bg-gray-100 dark:bg-gray-800
										border border-gray-300 dark:border-gray-700
										text-gray-900 dark:text-white
										focus:outline-none focus:border-emerald-500
									"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
								Email Address
							</label>
							<div className="relative">
								<Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="
										w-full pl-10 pr-4 py-2.5 rounded-xl
										bg-gray-100 dark:bg-gray-800
										border border-gray-300 dark:border-gray-700
										text-gray-900 dark:text-white
										focus:outline-none focus:border-emerald-500
									"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
								Phone Number
							</label>
							<div className="relative">
								<Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="
										w-full pl-10 pr-4 py-2.5 rounded-xl
										bg-gray-100 dark:bg-gray-800
										border border-gray-300 dark:border-gray-700
										text-gray-900 dark:text-white
										focus:outline-none focus:border-emerald-500
									"
									required
								/>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<button
							type="submit"
							disabled={userLoading}
							className="
								flex items-center gap-2 px-6 py-2.5 rounded-xl
								bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
								shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition
							"
						>
							{userLoading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
							Save Changes
						</button>
					</div>
				</motion.form>
			)}

			{/* USER HISTORY / PURCHASE HISTORY SECTION (Customer accounts only) */}
			{user?.role !== "admin" && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="space-y-6"
				>
					<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<ShoppingBag className="text-emerald-500" /> Purchase History & Orders
						</h2>
						<span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
							Total Orders: {orders.length}
						</span>
					</div>

					{ordersLoading ? (
						<div className="flex justify-center py-12">
							<Loader className="w-8 h-8 animate-spin text-emerald-500" />
						</div>
					) : orders.length === 0 ? (
						<div className="bg-white dark:bg-gray-900 rounded-2xl p-10 text-center border border-gray-200 dark:border-gray-800 space-y-3">
							<Package className="w-12 h-12 text-gray-400 mx-auto" />
							<p className="text-gray-600 dark:text-gray-400 font-medium">No order history found yet.</p>
							<p className="text-xs text-gray-400">Items you purchase will appear here in your purchase history.</p>
						</div>
					) : (
						<div className="space-y-6">
							{orders.map((order) => {
								const dateFormatted = new Date(order.createdAt).toLocaleString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								});

								return (
									<div
										key={order._id}
										className="
											bg-white dark:bg-gray-900
											border border-gray-200 dark:border-gray-800
											rounded-2xl p-6 shadow-sm hover:shadow-md transition space-y-4
										"
									>
										<div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-3 text-sm">
											<div className="space-y-1">
												<p className="text-xs text-gray-500 uppercase tracking-wider">Order ID</p>
												<p className="font-mono font-semibold text-gray-900 dark:text-white">
													#{order._id}
												</p>
											</div>

											<div className="flex items-center gap-6">
												<div className="space-y-1 text-right">
													<p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1 justify-end">
														<Calendar size={12} /> Date
													</p>
													<p className="text-gray-700 dark:text-gray-300 font-medium">
														{dateFormatted}
													</p>
												</div>

												<div className="space-y-1 text-right">
													<p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1 justify-end">
														<DollarSign size={12} /> Total Amount
													</p>
													<p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
														${order.totalAmount.toFixed(2)}
													</p>
												</div>
											</div>
										</div>

										{/* ORDER PRODUCTS LIST */}
										<div className="grid gap-3">
											{order.products?.map((item, idx) => {
												const prod = item.product || {};
												return (
													<div
														key={idx}
														className="
															flex items-center justify-between gap-4
															p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
														"
													>
														<div className="flex items-center gap-3">
															<img
																src={prod.image || "https://via.placeholder.com/50"}
																alt={prod.name || "Product"}
																className="w-12 h-12 rounded-lg object-cover bg-white"
															/>
															<div>
																<p className="font-semibold text-gray-900 dark:text-white text-sm">
																	{prod.name || "Product Item"}
																</p>
																<p className="text-xs text-gray-500 capitalize">
																	Category: {prod.category || "General"}
																</p>
															</div>
														</div>

														<div className="text-right">
															<p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
																${item.price?.toFixed(2)}
															</p>
															<p className="text-xs text-gray-500">Qty: {item.quantity}</p>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
};

export default ProfilePage;
