const mongoose = require("mongoose")
const {messageSchema} = require('./message')
const User = require('./user')

// console.log(mongoose.model('User'))

// KNOWN BUG: Cannot get User Schema and Model. Returns undefined. Below solution is workaround.
const conversationSchema = mongoose.Schema({
    // users: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
    users: {
        type: Array,
        default: []
    },
    messages: [messageSchema]
}, {
    timestamps: true
    // toObject: {
    //     getters:true
    // },
})

conversationSchema.methods.toJSON = function(){
    const conversation = this 
    const conversationObject = conversation.toObject()

//    conversationObject.users.map(user => {
//        delete user._id
//        delete user.password
//        delete user.createdAt
//        delete user.updatedAt
//    })

   conversationObject.messages.map(message => {
        delete message.user._id
        delete message.user.password
        delete message.user.updatedAt
    }) 


    return conversationObject
}

conversationSchema.statics.findUserConversations = async(user) => {
    const userObject = user.toJSON()
    const conversations = await Conversation.find({users: {
        $all: [
            {
                $elemMatch: {email: user.email}
            }
        ]
    }})
    .populate('messages.user')
    .sort({'updatedAt': -1})

    //method with user documents in users array
    // const conversations = await Conversation.find({users: {
    //     $all: [
    //         {
    //             $elemMatch: {_id: user._id}
    //         }
    //     ]
    // }})
    // .sort({'updatedAt': -1})

    //adjusted method with array containing objectId of users
    // const conversations = await Conversation.find({users: user._id})
    // .populate('messages.user')
    // // .populate("users")
    // .sort({'updatedAt': -1})
    // console.log(conversations)
    //sorts by updated with recent being on top
    userObject.conversations = conversations
    
    return userObject
}

conversationSchema.statics.findAssociatedConversation = async(emails) => {
    //multiple queries
    //goal is to iterate through the array of users in Conversation,
    //first, the email in the array of users must be included in the list passed
    //second, the size of array of users must also be equal to the size of the list
    //this simulates close to exact match of convo
    const conversation = await Conversation.findOne({
        //$and [] indicates multiple queries defined inside
        $and: [
            {
                //We can choose a specific attr iterating in the array
                "users.email": {
                    //selec all the email that exist in the list
                    $all: emails
                }
            },
            {
                "users": {
                    //the size also has to match
                    $size: emails.length
                }
            }
        ]
    })
    .populate('messages.user')
    return conversation
}

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation