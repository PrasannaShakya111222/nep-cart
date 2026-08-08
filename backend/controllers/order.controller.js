import Order from "../models/order.model.js";

export const getMyOrders = async (req, res) => {
	try {
		const userId = req.user._id;

		const orders = await Order.find({
			$or: [{ user: userId }, { user: userId.toString() }],
		})
			.populate({
				path: "products.product",
				select: "name price image category",
			})
			.sort({ createdAt: -1 });

		res.json({ orders });
	} catch (error) {
		console.log("Error in getMyOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
