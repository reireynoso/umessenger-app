const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    content: {
        type: String,
        require: true
    }
})

const Message = mongoose.model("Message", messageSchema)

module.exports = Message