const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cookieParser())

// 👇 FIX: CORS set for both local and live Vercel frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

/* require all routes here */
const authRouter = require('./routes/auth.routes')
const interviewRouter = require('./routes/interview.routes')

/* using all routes here */
app.use('/api/auth', authRouter)
app.use('/api/interview', interviewRouter)

module.exports = app