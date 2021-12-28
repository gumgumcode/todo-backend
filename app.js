require('dotenv').config()
require('express-async-errors')

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require("express-rate-limit")

// basic
const express = require('express')
const app = express()

// db connection
const connectDB = require('./db/connect')

// routers
const authRouter = require('./routes/auth')
const tasksRouter = require('./routes/tasks')

// middleware
const authenticateUser = require('./middleware/authentication')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// rate-limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// init
app.set('trust proxy', 1)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

// routes init
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', authenticateUser, tasksRouter)

// errorhandler init
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// listen + connectDB
const port = process.env.PORT || 8000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

// final init
start()