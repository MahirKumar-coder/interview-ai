const { Router } = require('express')
const { registerUserController, loginUserController, logoutUserController, getMeController } = require('../controllers/auth.controller')
const { authUser } = require('../middlewares/auth.middleware')

const authRouter = Router()

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login user, compare the password with the hashed password stored in database, if valid then generate a jwt token and send it to client
 * @access Public
 */

authRouter.post('/login', loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Logout user, add the token to blacklist so that it cannot be used again
 * @access Public
 */

authRouter.get('/logout', logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */

authRouter.get('/get-me', authUser, getMeController)

module.exports = authRouter

