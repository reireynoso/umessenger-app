const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

const multer = require('multer')
const upload = multer({
    // dest: 'images', passes data to request
    limits: {
        fileSize: 2000000
    },
    fileFilter(req,file,cb) {
        // cb(new Error('File must be pdf'))
        // cb(undefined)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Upload JPG JPEG or PNG'))
        }
        cb(undefined, true)
    }
})

router.post('/upload', upload.single('upload'), (req,res) => {
    console.log(req.body)
    req.file.buffer
    res.send()
}, (error, req,res, next) => {
    res.status(400).send({errors: [error.message]})
})

router.get('/test', async(req,res,next) => {
    try{
        const test = {message: "Server is live."}
        res.send(test)
    }catch(e){
        next(e)
    }
})

router.post('/users/signup', async(req,res) => {
    // console.log(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        // console.log(e)
        // next(e)
        res.status(500).send({errors: e})
    }
}, (error, req,res, next) => {
    res.status(400).send({errors: [error.message]})
})

router.post('/users/login', cors(), async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const userWithConversations = await Conversation.findUserConversations(user)
        // console.log(userWithConversations)
        const token = await user.generateAuthToken()
        res.send({user: userWithConversations, token})
    }catch(e){
        res.status(400).send({errors: ['Unable to login']})
    }
})

router.get('/users/auto_login', auth, async(req,res) => {
    const userWithConversations = await Conversation.findUserConversations(req.user)
    res.send(userWithConversations)
})

module.exports = router