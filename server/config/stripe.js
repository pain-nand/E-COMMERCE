const stripePack = require("stripe")
const dotenv = require("dotenv")

dotenv.config()

const stripe = new stripePack(process.env.STRIPE_SECRET_KEY)

module.exports = { stripe }