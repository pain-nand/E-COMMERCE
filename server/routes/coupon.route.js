const express = require("express")
const { protectRoute } = require("../middlewares/protectRoute")
const { getCoupon, validateCoupon } = require("../controllers/coupon.controller")

const router = express.Router()

router.get("/", protectRoute, getCoupon)
router.post("/validate", protectRoute, validateCoupon)

module.exports = router