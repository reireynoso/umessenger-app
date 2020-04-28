const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

router.get('/test', async(req,res,next) => {
    try{
        const user = await User.findOne({name: "Test"})
       
        const convos = await Conversation.find({users: {
            $all: [
                {
                    $elemMatch: {_id: user._id}
                }
            ]
        }})

        res.send({user, convos})
    }catch(e){
        next(e)
    }
})

router.post('/users/signup', async(req,res,next) => {
    // console.log(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        // console.log(e)
        next(e)
        // res.status(400).send({errors: e})
    }
})

router.post('/users/login', cors(), async(req,res) => {
    try{
        const user = User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send({error: 'Unable to login'})
    }
})

router.get('/users/auto_login', auth, async(req,res) => {
    res.send(req.user)
})

module.exports = router