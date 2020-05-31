const User = require('../models/user')
const {Message} = require('../models/message')
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
            password: await bcrypt.hash("test", 8),
            image_url: "https://png.pngtree.com/png-clipart/20190705/original/pngtree-cartoon-european-and-american-character-avatar-design-png-image_4366075.jpg"
        },
        {
            name: "sample",
            email: "sample@test.com",
            phone: 5555555555,
            password: await bcrypt.hash("sample", 8),
            image_url: "https://cdn0.iconfinder.com/data/icons/professional-avatar-5/48/manager_male_avatar_men_character_professions-512.png"
        },
        {
            name: "hello",
            email: "hello@test.com",
            phone: 7777777777,
            password: await bcrypt.hash("hello", 8),
            image_url: "https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
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

    // console.log('yo', users[0] instanceof User)
    const test = users[0].toInfo()
    const sample = users[1].toInfo()
    const hello = users[2].toInfo()
    const conversations = await Conversation.insertMany([
        {
            users: [test, sample],
            messages: [messages[1], messages[0]]
        },
        // {
        //     users: [users[0]],
        //     messages: [messages[1], messages[0]]
        // },
        {
            users: [hello, sample],
            messages: [messages[2], messages[3]]
        }
    ])

      // await conversations[0].messages.push(messages[1])

    // const some = await messages[0].populate("user")
    // console.log('yo', some)
    // const conversation = await Conversation.find({}).populate('messages.user').populate("users")
    // console.log(Object.keys(messages[0]))

    // console.log(conversation[0].users)

    // console.log(conversation[0].messages[0] instanceof Message)

    // users[0].conversations = [conversations[1], conversations[0]]
    // await users[0].save()
    // users[1].conversations = [conversations[1]]
    // await users[1].save()
    // console.log(conversations)
    console.log('seed')
}

module.exports = data