const express = require('express')
const router = new express.Router()
const cors = require('cors')
const sharp = require("sharp")
const multer = require('multer')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

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

router.get('/test', async(req,res,next) => {
    try{
        const test = {message: "Server is live."}
        res.send(test)
    }catch(e){
        next(e)
    }
})

router.get('/photo/:id', async(req,res) => {
    try{
        const user = await User.findById(req.params.id)
        console.log(user)
        res.set('Content-Type', 'image/png')
        res.send(user.image_storage)
    }catch(e){
        res.status(404).send()
    }
})

router.post('/users/signup', upload.single('upload'), async(req,res) => {
    // console.log(req.get('host'))// gets the base domain name from request
    let buffer;    
    if(req.file){
        buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer()
    }

    const user = new User({
        ...req.body,
        image_storage: req.file ? buffer : null
    })
    
    user.image_url = (req.file ? `http://${req.get('host')}/photo/${user._id}` : null)

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