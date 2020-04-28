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

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation