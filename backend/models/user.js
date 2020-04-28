const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const Conversation = require('./conversation')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim: true,
        lowercase:true
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
}, {
    timestamps: true,
    // toObject: {
        // virtuals: true
    //     getters:true
    // },
    // toJSON: {
    //     virtuals: true
    // }
})


// When Mongoose document is passed to res.send(), it's converted to JSON. 
// This method is customizing/overriding it it to return the necessary fields
userSchema.methods.toJSON = function(){
    const user = this 
    const userObject = user.toObject()

    delete userObject._id
    delete userObject.password

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY)
    
    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await user.findOne({email})
    if(!user){
        throw new Error({errors: ['Unable to login']})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error({errors: ['Unable to login']})
    }

    return user
}

//hashes plain text pw before saving

userSchema.pre('save', async function(next){
    const user = this

    //check if pw has been updated
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User