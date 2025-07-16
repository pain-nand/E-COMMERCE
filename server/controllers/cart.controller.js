const ProductModel = require('../models/Product.model')

const getCartProducts = async (req, res, next) => {
    try {
        const Products = await ProductModel.find({
            _id: { $in: req.user.cartItems }
        })

        const cartItems = Products.map((product) => {
           const item = req.user.cartItems.find((cartItems) => cartItems._id === product._id)
           return { ...product.toJSON(), quantity: item.quantity}      
        })
        return res.json(cartItems)
    }
    catch (error) {
        next(error)
    }
}

const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.body
        const user = req.user
        const existingItem = user.cartItems.find(item => item._id === productId)
        if (existingItem) {
            user.cartItems.quantity += 1
        }
        else {
            user.cartItems.push(productId)
        }
        await user.save()
        return res.json(user.cartItems)
    }
    catch (error) {
        next(error)
    }
}


const removeAllFromCart = async (req, res, next) => {
    try {
        const { productId } = req.body
        const user = req.user
        if (!productId) {
            user.cartItems = []
        }
        else {
            user.cartItems = user.cartItems.filter((item) => item._id !== productId)
        }
        await user.save()
        return res.json(user.cartItems)
    }
    catch (error) {
        next(error)
    }
}

const updatingQuantity = async (req, res, next) => {
    try {
        const { id: productId } = req.params
        const { quantity } = req.body
        const user = req.user
        const existingItem = user.cartItems.find((item) => item.id !== productId)
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter((item) => item.id !== productId)
                await user.save()
                return res.json(user.cartItems)
            }
            existingItem.quantity = quantity
            await user.save()
            return res.json(user.cartItems)
        }
        else {
            return res.status(404).json({message: "product not found"})
        }
    }
    catch (error) {
        next(error)
    }
}
module.exports = {
    getCartProducts,
    addToCart,
    removeAllFromCart,
    updatingQuantity
}