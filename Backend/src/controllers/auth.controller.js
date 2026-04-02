const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')

/**
 * @name registerUserController
 * @description register a new user, except the password should be hashed before saving to database
 * @access Public 
 */

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const isUserALreadyExist = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isUserALreadyExist) {
            return res.status(400).json({
                message: 'User already exist with this username or email address'
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        res.cookie('token', token)

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message: `Internal server error ${error}`
        })
    }
}

/**
 * 
 * @name loginUserController
 * @description login user, compare the password with the hashed password stored in database, if valid then generate a jwt token and send it to client
 * @access Public
 */

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        res.cookie('token', token)

        res.status(201).json({
            message: 'User loggedin successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            message: `Internal server error ${error}`
        })
    }
}

/**
 * 
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 */

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie('token')

        res.status(201).json({
            message: 'User logged out successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: `Internal server error ${error}`
        })
    }
}

/**
 * 
 * @name getMeController
 * @description get the current loggedin user details
 * @access private
 */

async function getMeController(req, res) {
    try {

        const user = await userModel.findById(req.user.id)

        return res.status(201).json({
            message: 'user detail fetched successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            message: `Internal server error ${error}`
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}