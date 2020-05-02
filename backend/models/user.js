const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')

// const Conversation = require('./conversation')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique:true,
        trim: true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not formatted')
            }
        }
    },
    phone: {
        type: Number,
        required: [true, 'Phone is required'],
        unique: true,
        trim: true,
        validate(value){
            // console.log(validator.isMobilePhone('98072'))
            // console.log(validator.isMobilePhone(value.toString()))
            if(!validator.isMobilePhone(value.toString())){
                throw new Error('Phone is not valid format')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
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
    const user = await User.findOne({email})
    // console.log(user)
    if(!user){
        throw new Error()
    }

    const isMatch = await bcrypt.compare(password, user.password)
    // console.log(isMatch)
    if(!isMatch){
        throw new Error()
    }

    return user
}

userSchema.statics.checkIfEmailsAreValid = async(emailList) => {
    const users = await User.find({
        email: {
            $in: emailList
        }
    })

    if(users.length !== emailList.length){
        throw new Error()
    }

    return users
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

userSchema.post('save', function(error, doc, next) {
    //handles errors when attempting to save a user instance upon creation
    const errors = [];
    if(error.name === "MongoError" && error.code === 11000){
        const fieldArray = Object.keys(error.keyValue)
        errors.push(fieldArray[0].charAt(0).toUpperCase() + fieldArray[0].slice(1) + " already exists.")
    }
    else if(error.name === "ValidationError"){
        const fieldArray = Object.keys(error.errors)
        for(let i = 0; i<fieldArray.length; i++){
           errors.push(error.errors[fieldArray[i]].message)
        }
    }
    else{
        // res.status(500).send({error: "There was an error."})
        // next()
        errors.push('There is an error.')
    }
    next(errors)
});

const User = mongoose.model('User', userSchema)

module.exports = User