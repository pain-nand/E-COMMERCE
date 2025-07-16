const express = require("express")
const { protectRoute, adminAuthorization } = require("../middlewares/protectRoute")
const { getAnalyticsData } = require("../controllers/analytics.controllers")

const router = express.Router()

router.get("/", protectRoute, adminAuthorization, getAnalyticsData)

module.exports = router