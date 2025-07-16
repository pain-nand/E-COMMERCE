
const { getCartProducts, addToCart, updatingQuantity, removeAllFromCart } = require('../controllers/cart.controller')
const { protectRoute } = require('../middlewares/protectRoute')

const router = require("express").Router()

router.get("/", protectRoute, getCartProducts)
router.post("/", protectRoute, addToCart)
router.delete("/", protectRoute, removeAllFromCart)
router.put("/:id", protectRoute, updatingQuantity)

module.exports = router