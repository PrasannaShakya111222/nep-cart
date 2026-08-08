import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Save, Loader, ShoppingBag } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["fashion", "shoes", "electronics", "bags", "accessories"];

const EditProductModal = ({ product, onClose }) => {
	const { updateProduct, loading } = useProductStore();

	const [name, setName] = useState(product?.name || "");
	const [description, setDescription] = useState(product?.description || "");
	const [price, setPrice] = useState(product?.price || "");
	const [category, setCategory] = useState(product?.category || "fashion");
	const [image, setImage] = useState(product?.image || "");

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await updateProduct(product._id, {
			name,
			description,
			price: Number(price),
			category,
			image,
		});
		if (success) {
			onClose();
		}
	};

	if (!product) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					className="
						w-full max-w-lg
						bg-white dark:bg-gray-900
						border border-gray-200 dark:border-gray-700
						rounded-2xl shadow-2xl p-6 relative my-8
					"
				>
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
					>
						<X size={20} />
					</button>

					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
						<ShoppingBag className="text-emerald-500" /> Edit Product
					</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
								Product Name
							</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="
									w-full px-4 py-2.5 rounded-xl
									bg-gray-100 dark:bg-gray-800
									border border-gray-300 dark:border-gray-700
									text-gray-900 dark:text-white
									focus:outline-none focus:border-emerald-500
								"
								required
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
								Description
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={3}
								className="
									w-full px-4 py-2.5 rounded-xl
									bg-gray-100 dark:bg-gray-800
									border border-gray-300 dark:border-gray-700
									text-gray-900 dark:text-white
									focus:outline-none focus:border-emerald-500
								"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
									Price ($)
								</label>
								<input
									type="number"
									step="0.01"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									className="
										w-full px-4 py-2.5 rounded-xl
										bg-gray-100 dark:bg-gray-800
										border border-gray-300 dark:border-gray-700
										text-gray-900 dark:text-white
										focus:outline-none focus:border-emerald-500
									"
									required
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
									Category
								</label>
								<select
									value={category}
									onChange={(e) => setCategory(e.target.value)}
									className="
										w-full px-4 py-2.5 rounded-xl
										bg-gray-100 dark:bg-gray-800
										border border-gray-300 dark:border-gray-700
										text-gray-900 dark:text-white
										focus:outline-none focus:border-emerald-500 capitalize
									"
								>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>
						</div>

						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
								Product Image
							</label>
							<div className="flex items-center gap-4 mt-2">
								{image && (
									<img
										src={image}
										alt="Preview"
										className="w-16 h-16 rounded-xl object-cover border border-gray-300 dark:border-gray-700"
									/>
								)}
								<label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition">
									<Upload size={16} /> Upload New Image
									<input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
								</label>
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 font-medium transition"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={loading}
								className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
							>
								{loading ? <Loader className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
							</button>
						</div>
					</form>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};

export default EditProductModal;
