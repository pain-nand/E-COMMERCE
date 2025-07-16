const jwt = require("jsonwebtoken")
const UserModel = require("../models/User.model")


const protectRoute = async (req, res, next) => {
    const token = req.cookies.access_token
  try {
       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
       const user = await UserModel.findById(decoded.userId).select("-password")
       if (!user || !token) {
        return res.status(401).json({ error: "Unauthorized" })

       }
       console.log(user)
       req.user = user
       next()
       
    } 
    catch(error) {
        return res.status(401).json({ error: "unauthorized" })
    }

}
 
const adminAuthorization = (req, res, next) => {
    if (req.user && req.user.roles === "admin") {
        next()
    }
    else {
        return res.status(403).json({error: "Access denied"})
    }
}


module.exports = {
    protectRoute,
    adminAuthorization
}