const UserModel = require("../models/User.model")
const jwt = require("jsonwebtoken")

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '15m'
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: '7d'
    })
    return { accessToken, refreshToken }
}

const setcookies = (res, accessToken, refreshToken) => {
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

}

const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const userExists = await UserModel.findOne({ email })

        if(userExists) {
            return res.status(400).json({ error: "User already exists" })
        }
        const user = await UserModel.create({
            name, email, password
        })
        const { accessToken, refreshToken } = generateTokens(user._id)
        setcookies(res, accessToken, refreshToken)
        return res.status(200).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.roles
            },
            message: "Account created successfully"
        })
    }
    catch(error) {
        next(error)
    }
}

const signinController = async (req, res) => {
    try {
       const { email, password } = req.body
       const user = await UserModel.findOne({ email})
       if (user && await user.comparePassword(password)) {
        const { accessToken, refreshToken } = generateTokens(user._id)
        setcookies(res, accessToken, refreshToken)
        return res.status(200).json({
            user: {
               _id: user._id,
               name: user.name,
               email: user.email,
               role: user.roles 
            },
            message: "Account login successfully"
        })
       }
       else {
        return res.status(401).json({ error: "Invalid credentials" })
       }
    }
    catch(error) {
        next(error)
    }
}
const logoutController = async (req, res) => {
   try {
    res.clearCookie("access_token")
    res.clearCookie("refresh_token")
    return res.status(200).json({ message: "Account logout successfull" })
   }
   catch (error) {
    next (error)
   }
}
const refreshTokenController = async (req, res) => {
   try {
    const refresh_token = req.cookies.refresh_token
    if (!refresh_token) {
        return res.status(401).json({ error: "unauthorised error" })
    }
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY)
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: '15m'
    })

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })

    return res.json({ message: "token created successfull" })

   }
   catch (error) {
    next(error)
   }
}
const profileController = async (req, res) => {
    try {
        return res.status(200).json(req.user)
    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    signupController,
    signinController,
    logoutController,
    refreshTokenController,
    profileController
}