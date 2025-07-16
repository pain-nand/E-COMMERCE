const mongoose = require("mongoose")

const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true,
                min: 10
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 10
    },
    stripeSessionId: {
        type: String,
        unique: true
    }
}, {timestamps: true})


const OrderModel = mongoose.model("orders", OrderSchema)

module.exports = OrderModel