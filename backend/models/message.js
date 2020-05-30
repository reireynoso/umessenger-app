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
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema)

module.exports = {Message, messageSchema}