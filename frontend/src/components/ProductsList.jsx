import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  return (
    <motion.div
      className="
        max-w-4xl
        mx-auto
        rounded-lg
        overflow-hidden
        shadow-lg

        bg-white
        border
        border-gray-200

        dark:bg-gray-800
        dark:border-gray-700

        transition-colors
        duration-300
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead
          className="
            bg-gray-100
            dark:bg-gray-700
          "
        >
          <tr>
            {["Product", "Price", "Category", "Featured", "Actions"].map(
              (title) => (
                <th
                  key={title}
                  className="
                    px-6
                    py-3
                    text-left
                    text-xs
                    font-medium
                    uppercase
                    tracking-wider

                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  {title}
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody
          className="
            divide-y
            divide-gray-200

            bg-white

            dark:bg-gray-800
            dark:divide-gray-700
          "
        >
          {products?.map((product) => (
            <tr
              key={product._id}
              className="
                hover:bg-gray-100
                dark:hover:bg-gray-700

                transition-colors
              "
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="
                        h-10
                        w-10
                        rounded-full
                        object-cover
                      "
                      src={product.image}
                      alt={product.name}
                    />
                  </div>

                  <div className="ml-4">
                    <div
                      className="
                        text-sm
                        font-medium

                        text-gray-900
                        dark:text-white
                      "
                    >
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className="
                    text-sm

                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  ${product.price.toFixed(2)}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className="
                    text-sm

                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  {product.category}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`
                    p-1
                    rounded-full
                    transition-colors
                    duration-200

                    ${
                      product.isFeatured
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                    }

                    hover:bg-yellow-500
                  `}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="
                    text-red-500
                    hover:text-red-700

                    dark:text-red-400
                    dark:hover:text-red-300
                  "
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
