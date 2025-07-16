const authRouter = require("./auth.route")
const productRouter  = require("./product.route")
const cartRouter = require("./cart.route")
const couponsRouter = require("./coupon.route")
const paymentRouter = require("./payment.route")
const analyticsRouter = require("./analytics.route")
const express = require("express")

const router = express.Router()


router.use("/auth", authRouter)
router.use("/product", productRouter)
router.use("/cart", cartRouter)
router.use("/coupons", couponsRouter)
router.use("/payment", paymentRouter)
router.use("/analytics", analyticsRouter)




module.exports = router