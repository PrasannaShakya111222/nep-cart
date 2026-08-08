import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products, loading } = useProductStore();
	const { category } = useParams();
	const location = useLocation();

	const searchParams = new URLSearchParams(location.search);
	const search = searchParams.get("search") || "";

	useEffect(() => {
		fetchProductsByCategory(category, search);
	}, [fetchProductsByCategory, category, search]);

	const titleText = search
		? `Search Results for "${search}"`
		: category === "all"
		? "All Products"
		: category.charAt(0).toUpperCase() + category.slice(1);

	return (
		<div className="min-h-screen">
			<div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<motion.h1
					className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8 capitalize"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{titleText}
				</motion.h1>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{!loading && products?.length === 0 && (
						<h2 className="text-3xl font-semibold text-gray-400 dark:text-gray-300 text-center col-span-full py-12">
							No products found for this search.
						</h2>
					)}

					{products?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default CategoryPage;
