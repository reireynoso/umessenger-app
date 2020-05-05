const express = require('express')
const router = new express.Router()
const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')
const Message = require('../models/message')

router.post("/conversations", auth, async(req,res) => {
    try{
        // const user = await User.findOne({name: "Test"})
        // console.log(req.body.emails)
        //make sure to include the user in the list
        const recipients = [...req.body.emails, req.user.email]
        console.log(recipients)
        const content = req.body.content
        //query for users in database whose names are included in list
        //$in email is included in the given list
        const users = await User.checkIfEmailsAreValid(recipients) 
        // const users = await User.find({
        //     email: {
        //         $in: user
        //     }
        // })

        //if it doesn't match the length compared to the list, an email is invalid.
        // const convos = await Conversation.find({users: {
        //     $all: [
        //         {
        //             $elemMatch: {email: user[0]}
        //         }
        //     ]
        // }})
        // const sampleUser = await User.findOne({name: "Test"})
        const user = req.user

        // const convos = await Conversation.find({
        //     $and: [
        //         {
        //             "users.email": {
        //                 $in: user.map(u => u)
        //             }
        //         },

        //     ]
        // })
        const newMessage = await new Message({user, content})
        await newMessage.save()

        //multiple queries
        //goal is to iterate through the array of users in Conversation,
        //first, the email in the array of users must be included in the list passed
        //second, the size of array of users must also be equal to the size of the list
        //this simulates close to exact match of convo
        const existingConversation = await Conversation.findAssociatedConversation(recipients)
        // console.log(existingConversation)
        if(!existingConversation){
            //if no existingConversation exist, create a convo and push message in array message, with users
            // console.log(existingConversation)
            const newConversation = await new Conversation({users, messages:[newMessage]})
            await newConversation.save()
            // newConversation.users.push()
            res.send(newConversation)
        }
        else{
            //push message into existing convos message array
            // console.log("hey")
            existingConversation.messages.push(newMessage)
            await existingConversation.save()
            // console.log(existingConversation.messages)

            res.send({conversation: existingConversation})
        }
        // const convos = await Conversation.find({
        //     //$and [] indicates multiple queries defined inside
        //     $and: [
        //         {
        //             //We can choose a specific attr iterating in the array
        //             "users.email": {
        //                 //selec all the email that exist in the list
        //                 $all: user
        //             }
        //         },
        //         {
        //             "users": {
        //                 //the size also has to match
        //                 $size: user.length
        //             }
        //         }
        //     ]
        // })

        // res.send({convos})
    }catch(e){
        // console.log(e)
        res.send({errors: ["An email provided is invalid."]})
    }
})

module.exports = router