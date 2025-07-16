const mongoose = require("mongoose")

const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already taken"],
        lowerCase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"]
    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            }
        }
    ],
    roles: {
        type: String,
       default: "admin",
        enum: ["customer", "admin"]
    }
}, { timestamps: true })


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    try {
        (this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(10)))
        
        next()
    }    
    catch (error) {
        console.log(error)
    }
})


UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const UserModel = mongoose.model("users", UserSchema)

module.exports = UserModel