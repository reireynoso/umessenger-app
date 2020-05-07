const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
// const errorHandling = require('./middleware/errorHandling')
require('dotenv').config()
require('./db/mongoose')
const data = require("./db/seed")

const userRouter = require('./routers/user')
const convoRouter = require('./routers/conversation')

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.use(userRouter)
app.use(convoRouter)

//set up web sockets

const server = http.createServer(app);
const io = socketio(server)

io.on('connection', (socket) => {
    console.log('New Connection')

    socket.on('viewConversation', () => {
        console.log('viewingConvo')
    })

    socket.on('disconnect', () => {
        console.log('someone had left')
    })
})

server.listen(port, () => {
    // data()
    console.log('Server is up on ' + port)
})