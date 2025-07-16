const router = require("express").Router()
const { getAllProducts, createProduct, getRecommendedProducts, getFeaturedProducts, toggleFeaturedProduct, deleteProduct, getProductsByCategory } = require("../controllers/product.controller")
const { protectRoute, adminAuthorization } = require("../middlewares/protectRoute")


router.get("/", protectRoute, adminAuthorization, getAllProducts)
router.post("/", protectRoute, adminAuthorization, createProduct)
router.get("/recommendations", getRecommendedProducts)
router.get("/featured", getFeaturedProducts)
router.patch("/:id", protectRoute, toggleFeaturedProduct)
router.delete("/:id", protectRoute, adminAuthorization, deleteProduct)
router.get('/category/:category', getProductsByCategory)

module.exports = router
