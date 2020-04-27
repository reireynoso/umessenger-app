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
})

const Conversation = mongoose.model("Conversation", conversationSchema)

module.exports = Conversation