const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

router.get("/conversations", async(req,res) => {
    try{
        // const user = await User.findOne({name: "Test"})
        const user = ["hello@test.com","test@test.com"]
        // const convos = await Conversation.find({users: {
        //     $all: [
        //         {
        //             $elemMatch: {email: user[0]}
        //         }
        //     ]
        // }})

        // const convos = await Conversation.find({
        //     $and: [
        //         {
        //             "users.email": {
        //                 $in: user.map(u => u)
        //             }
        //         },

        //     ]
        // })

        //multiple queries
        //goal is to iterate through the array of users in Conversation,
        //first, the email in the array of users must be included in the list passed
        //second, the size of array of users must also be equal to the size of the list
        //this simulates close to exact match of convo

        const convos = await Conversation.find({
            //$and [] indicates multiple queries defined inside
            $and: [
                {
                    //We can choose a specific attr iterating in the array
                    "users.email": {
                        //selec all the email that exist in the list
                        $all: user
                    }
                },
                {
                    "users": {
                        //the size also has to match
                        $size: user.length
                    }
                }
            ]
        })

        res.send({convos})
    }catch(e){
        console.log('hey')
    }
})

module.exports = router