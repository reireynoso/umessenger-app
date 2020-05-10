const User = require('../models/user')
const Message = require('../models/message')
const Conversation = require('../models/conversation')

const bcrypt = require('bcryptjs')

const data = async() => {
    Message.collection.deleteMany({})
    User.collection.deleteMany({})
    Conversation.collection.deleteMany({})
    
    const users = await User.insertMany([
        {
            name: "Test",
            email: "test@test.com",
            phone: 9999999999,
            password: await bcrypt.hash("test", 8)
        },
        {
            name: "sample",
            email: "sample@test.com",
            phone: 5555555555,
            password: await bcrypt.hash("sample", 8)
        },
        {
            name: "hello",
            email: "hello@test.com",
            phone: 7777777777,
            password: await bcrypt.hash("hello", 8)
        }
    ])

    const messages = await Message.insertMany([
        {
            user: users[0],
            content: "hello there"
        },
        {
            user: users[1],
            content: "hey!"
        },
        {
            user: users[2],
            content: "heyoooo!"
        },
        {
            user: users[1],
            content: "sajndlasndals!"
        },
    ])

    const conversations = await Conversation.insertMany([
        {
            users: [users[0], users[1]],
            messages: [messages[1], messages[0]]
        },
        // {
        //     users: [users[0]],
        //     messages: [messages[1], messages[0]]
        // },
        // {
        //     users: [users[2], users[1]],
        //     messages: [messages[1], messages[0]]
        // }
    ])

    // users[0].conversations = [conversations[1], conversations[0]]
    // await users[0].save()
    // users[1].conversations = [conversations[1]]
    // await users[1].save()
    console.log('seed')
}

module.exports = data