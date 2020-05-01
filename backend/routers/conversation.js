const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

router.get("/conversations", async(req,res) => {
    try{
        // const user = await User.findOne({name: "Test"})
        const user = ["sample@test.com", "test@test.com" ]
        // const convos = await Conversation.find({users: {
        //     $all: [
        //         {
        //             $elemMatch: {email: user[0]}
        //         }
        //     ]
        // }})

        const convos = await Conversation.find(
          
                {
                    "users.email": {
                        $in: user.map(u => u)
                    }
                }
            
        )

        res.send({convos})
    }catch(e){
        console.log('hey')
    }
})

module.exports = router