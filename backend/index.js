const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
// const errorHandling = require('./middleware/errorHandling')
process.env.NODE_ENV === 'production' ? null : require('dotenv').config()
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

const onlineUsers = {

}

io.on('connection', (socket) => {
    console.log('New Connection')

    socket.on('online', (user) => {
        // console.log(user)
        onlineUsers[user.email] = socket.id
        // console.log(onlineUsers)
        // if(onlineUsers[user.email]){
        //     console.log(onlineUsers[user.email])
        // }
    })
    
    socket.on('subscribeToConversation', (conversation) => {
        // io.sockets.emit('typing', input)
        socket.join(conversation._id)
        // console.log(socket.rooms) // check sockets joined rooms
    })

    socket.on('leaveConversation', (conversation) => {
        socket.leave(conversation._id)
    })

    // Why two typing listeners? For the one messageContainer, every time we select a new conversation, the component adds another typing listener.
    // To prevent that, on unmount, we turn the socket listener off but it turns it off for the SegmentConversation component

    socket.on('typing', ({selectedConversation,user,content}) => {
        // console.log(content)
        // console.log(selectedConversation._id)
        socket.broadcast.to(selectedConversation._id).emit('typing', {selectedConversation,user,content})
        // io.to(conversation).emit('typing', "someone is typing")
    })

    socket.on('messageTyping', ({selectedConversation,user,content}) => {
        // console.log(selectedConversation)
        socket.broadcast.to(selectedConversation._id).emit('messageTyping', {selectedConversation,user,content})
        // io.to(conversation).emit('typing', "someone is typing")
    })

    socket.on('disconnect', () => {
        console.log('someone had left')
        //removes user from object list by socket id
        for(let key in onlineUsers){
            if(onlineUsers[key] === socket.id){
                delete onlineUsers[key]
            }
        }
        // console.log('dipped', onlineUsers)
    })
})

app.io = io
app.onlineUsers = onlineUsers

server.listen(port, () => {
    data()
    console.log('Server is up on ' + port)
})