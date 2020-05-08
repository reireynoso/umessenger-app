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

    socket.on('typing', (input) => {
        io.sockets.emit('typing', input)
    })

    socket.on('subscribeToConversation', (conversation) => {
        // io.sockets.emit('typing', input)
        // console.log(conversation._id)
        socket.join(conversation._id)
    })

    socket.on('disconnect', () => {
        console.log('someone had left')
    })
})

app.io = io

server.listen(port, () => {
    // data()
    console.log('Server is up on ' + port)
})