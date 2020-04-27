const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

const data = async() => {
    Message.collection.deleteMany({})
    User.collection.deleteMany({})
    Conversation.collection.deleteMany({})
    
    const users = await User.insertMany([
        {
            name: "Test",
            email: "test@test.com",
            phone: 999,
            password: "test"
        },
        {
            name: "sample",
            email: "sample@test.com",
            phone: 555,
            password: "sample"
        },
    ])

    const messages = await Message.insertMany([
        {
            user: users[0],
            content: "hello there"
        },
        {
            user: users[1],
            content: "hey!"
        }
    ])

    const conversations = await Conversation.insertMany([
        {
            users: [users[0], users[1]],
            messages: [messages[1], messages[0]]
        },
        {
            users: [users[0]],
            messages: [messages[1], messages[0]]
        }
    ])

    // users[0].conversations = [conversations[1], conversations[0]]
    // await users[0].save()
    // users[1].conversations = [conversations[1]]
    // await users[1].save()
    console.log('seed')
}

module.exports = data