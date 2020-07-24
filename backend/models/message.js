const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    content: {
        type: String,
        require: true
    },
    reactions: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema)

module.exports = {Message, messageSchema}