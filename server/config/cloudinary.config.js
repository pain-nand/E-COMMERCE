const { v2 : cloudinary } = require("cloudinary")
const dotenv = require("dotenv")

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API
})

module.exports = cloudinary
