const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')


router.post('/users/signup', async(req,res) => {
    console.log(req.body)
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/login', cors(), async(req,res) => {
    try{
        const user = User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send({errors: ['Unable to login']})
    }
})

router.get('/users/auto_login', auth, async(req,res) => {
    try{
        res.send(req.user)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router