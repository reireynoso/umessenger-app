const mongoose = require("mongoose")

const conversationSchema = mongoose.Schema({
    users: {
        type: Array,
        default: []
    },
    messages: {
        type: Array,
        default: []
    }
}, {
    // toObject: {
    //     getters:true
    // },
})

conversationSchema.methods.toJSON = function(){
    const conversation = this 
    const conversationObject = conversation.toObject()

   conversationObject.users.map(user => {
       delete user._id
       delete user.password
       delete user.createdAt
       delete user.updatedAt
   })

    return conversationObject
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
    return conversation
}

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation