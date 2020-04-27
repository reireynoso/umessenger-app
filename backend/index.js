const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./db/mongoose')
const data = require("./db/seed")

const userRouter = require('./routers/user')

const app = express()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.use(userRouter)

app.listen(port, () => {
    // data()
    console.log('Server is up on ' + port)
})