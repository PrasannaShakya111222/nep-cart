import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongodb
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      price === "" ||
      !category
    ) {
      return res
        .status(400)
        .json({
          message: "Please provide name, description, price, and category.",
        });
    }

    let imageUrl =
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";

    if (image && image.trim()) {
      if (image.startsWith("data:image")) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(image, {
            folder: "products",
          });
          if (cloudinaryResponse?.secure_url) {
            imageUrl = cloudinaryResponse.secure_url;
          }
        } catch (uploadErr) {
          console.log(
            "Cloudinary upload error in createProduct:",
            uploadErr.message,
          );
          imageUrl = image;
        }
      } else {
        imageUrl = image;
      }
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: imageUrl,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res
      .status(400)
      .json({ message: error.message || "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;

    if (image && image !== product.image) {
      if (image.startsWith("data:image")) {
        if (product.image) {
          const publicId = product.image.split("/").pop().split(".")[0];
          try {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (err) {
            console.log("Error destroying old image", err);
          }
        }
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        product.image = cloudinaryResponse.secure_url;
      } else {
        product.image = image;
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloduinary");
      } catch (error) {
        console.log("error deleting image from cloduinary", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const { search } = req.query;

  try {
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search && search.trim()) {
      const stopWords = [
        "show",
        "me",
        "a",
        "an",
        "to",
        "the",
        "find",
        "i",
        "want",
        "get",
        "please",
        "can",
        "you",
        "look",
        "for",
        "is",
        "are",
        "give",
        "display",
        "search",
        "buy",
        "need",
      ];

      const cleanedWords = search
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word && !stopWords.includes(word));

      const keywords = cleanedWords.length > 0 ? cleanedWords : [search.trim()];

      const keywordConditions = keywords.map((word) => {
        const regex = new RegExp(word, "i");
        return {
          $or: [{ name: regex }, { description: regex }, { category: regex }],
        };
      });

      if (keywordConditions.length === 1) {
        filter.$or = keywordConditions[0].$or;
      } else {
        filter.$and = keywordConditions;
      }
    }

    const products = await Product.find(filter);
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // The lean() method  is used to return plain JavaScript objects instead of full Mongoose documents. This can significantly improve performance

    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}
