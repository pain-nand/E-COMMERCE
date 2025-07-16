const mongoose = require("mongoose")

const CouponSchema = new mongoose.Schema({
    cosr: {
        type: String,
        required: true,
        unique: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 10,
        max: 60
    },
    expirationDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    }
}, {timestamps: true})

const CouponModel = mongoose.model("coupons", CouponSchema)

module.exports = CouponModel