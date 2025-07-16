const express = require("express")
const { adminAuthorization, protectRoute } = require("../middlewares/protectRoute")
const { createCheckoutSession, checkoutSuccess } = require("../controllers/payment.controller")

const router  = express.Router()

router.post("/checkout-session", protectRoute, createCheckoutSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)

module.exports = router