const { signupController, signinController, logoutController, refreshTokenController, profileController } = require("../controllers/auth.controller");
const { protectRoute } = require("../middlewares/protectRoute");

const router = require("express").Router()

router.post("/signup", signupController)
router.post("/signin", signinController)
router.post("/logout", protectRoute, logoutController)
router.post("/refresh-token", protectRoute, refreshTokenController)
router.get("/profile", protectRoute, profileController)


module.exports = router