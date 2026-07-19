import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(newProduct);

      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch (error) {
      console.log("Create product error:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewProduct({
        ...newProduct,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      className="
        max-w-xl
        mx-auto
        p-8
        rounded-xl
        shadow-xl

        bg-white
        text-gray-900
        border
        border-gray-200

        dark:bg-gray-800
        dark:text-white
        dark:border-gray-700

        transition-colors
        duration-300
      "
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <h2
        className="
          text-3xl
          font-bold
          mb-6
          text-emerald-500
        "
      >
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}

        <div>
          <label className="block mb-2 text-sm font-medium">Product Name</label>

          <input
            type="text"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                name: e.target.value,
              })
            }
            className="
              w-full
              px-4
              py-3
              rounded-lg
              border

              bg-gray-100
              border-gray-300

              dark:bg-gray-700
              dark:border-gray-600

              outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
            required
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label className="block mb-2 text-sm font-medium">Description</label>

          <textarea
            rows="4"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                description: e.target.value,
              })
            }
            className="
              w-full
              px-4
              py-3
              rounded-lg
              border

              bg-gray-100
              border-gray-300

              dark:bg-gray-700
              dark:border-gray-600

              outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
            required
          />
        </div>

        {/* PRICE */}

        <div>
          <label className="block mb-2 text-sm font-medium">Price</label>

          <input
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value,
              })
            }
            className="
              w-full
              px-4
              py-3
              rounded-lg
              border

              bg-gray-100
              border-gray-300

              dark:bg-gray-700
              dark:border-gray-600

              outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
            required
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label className="block mb-2 text-sm font-medium">Category</label>

          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                category: e.target.value,
              })
            }
            className="
              w-full
              px-4
              py-3
              rounded-lg
              border

              bg-gray-100
              border-gray-300

              dark:bg-gray-700
              dark:border-gray-600

              outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE */}

        <div>
          <label
            htmlFor="image"
            className="
              cursor-pointer
              inline-flex
              items-center
              gap-2

              px-4
              py-3
              rounded-lg

              bg-gray-200
              dark:bg-gray-700

              hover:bg-gray-300
              dark:hover:bg-gray-600
            "
          >
            <Upload size={20} />
            Upload Image
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {newProduct.image && (
            <p className="mt-2 text-sm text-emerald-500">Image uploaded</p>
          )}
        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="
            w-full

            flex
            items-center
            justify-center
            gap-2

            py-3

            rounded-lg

            bg-emerald-600
            hover:bg-emerald-700

            text-white
            font-semibold

            disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <Loader className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
