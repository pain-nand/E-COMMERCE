const express = require("express")
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const apiRouter = require("./routes/index")
const connectDB = require("./config/db.config")
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use
   (cors({
      origin: "http://localhost:5173/",
      credentials: true,
   }));

app.use(cookieParser())
app.use("/api", apiRouter)
 app.use((error, req, res, next) => {
      console.error(error)
      return res.status(500).json({error: "Internal server error"})
  })
app.listen(PORT, () => {
    console.log(`SERVER WAS STARTED ON ${PORT} PORT`)
    connectDB()
})