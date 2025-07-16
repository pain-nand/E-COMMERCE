const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const connectDb = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MONGODB is connected ${connectDb.connection.host}`)
    }
    catch (error) {
    console.log(error)
    }
}

module.exports = connectDB