const cloudinary = require("../config/cloudinary.config")
const ProductModel = require("../models/Product.model")

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    return res.json({ products });
  } catch (error) {
    console.log(`error in getAllProduct controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await ProductModel.find({ isFeatured: true })
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    return res.json(featuredProducts);
  } catch (error) {
    console.log(`error in getFeaturedProducts controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getRecommendedProducts = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $sample: { size: 4 } },
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
    return res.json(products);
  } catch (error) {
    console.log(`error in getRecommendedProducts controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await ProductModel.find({ category });
    return res.json({ products });
  } catch (error) {
    console.log(`error in getProductsByCategory controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    let { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      try {
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        image = cloudinaryResponse.secure_url || "";
      } catch (error) {
        console.log(error.message);
      }
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      category,
      image,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.log(`error in createProduct controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};

const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      return res.json(updatedProduct);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(`error in toggleFeaturedProduct controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await ProductModel.find({ isFeatured: true }).lean();
    // await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.log(`error deleting image from cloudinary `, error);
      }
    }

    await ProductModel.findByIdAndDelete(req.params.id);
    return res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log(`error in deleteProduct controller ${error.message}`);
    return res.status(500).json({ error: "internal server error" });
  }
};


module.exports = {
    getAllProducts,
    getFeaturedProducts,
    getRecommendedProducts,
    getProductsByCategory,
    createProduct,
    toggleFeaturedProduct,
    updateFeaturedProductsCache,
    deleteProduct
}