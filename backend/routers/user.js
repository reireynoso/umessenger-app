const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

router.get('/test', async(req,res,next) => {
    try{
        const user = await User.findOne({name: "Test"})
       
        // const convos = await Conversation.find({users: {
        //     $all: [
        //         {
        //             $elemMatch: {_id: user._id}
        //         }
        //     ]
        // }})

        const yo = await Conversation.findUserConversations(user)
        // const yo = await user.findUserConversations()
        res.send({yo})
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
})

router.post('/users/login', cors(), async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const userWithConversations = await Conversation.findUserConversations(user)
        const token = await user.generateAuthToken()
        res.send({userWithConversations, token})
    }catch(e){
        res.status(400).send({errors: ['Unable to login']})
    }
})

router.get('/users/auto_login', auth, async(req,res) => {
    const userWithConversations = await Conversation.findUserConversations(req.user)
    res.send(userWithConversations)
})

module.exports = router