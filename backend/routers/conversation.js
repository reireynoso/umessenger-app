const express = require('express')
const router = new express.Router()
// const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')
const {Message} = require('../models/message')

router.post("/conversations", auth, async(req,res) => {
    try{
        // const user = await User.findOne({name: "Test"})
        //make sure to include the user in the list
        const recipients = [...req.body.emails, req.user.email]
        // console.log(recipients)
        const content = req.body.content

        if(!content){
            throw "Message cannot be empty!"
        }
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
        // const newMessage = await new Message({user, content})
        // await newMessage.save()

        const newMessage = {user,content}

        //multiple queries
        //goal is to iterate through the array of users in Conversation,
        //first, the email in the array of users must be included in the list passed
        //second, the size of array of users must also be equal to the size of the list
        //this simulates close to exact match of convo
        const existingConversation = await Conversation.findAssociatedConversation(recipients)
    
        if(!existingConversation){
            //if no existingConversation exist, create a convo and push message in array message, with users
            // console.log(existingConversation)
            const newConversation = await new Conversation({users, messages:[newMessage]})
            await newConversation.save()
            // newConversation.users.push()
            //iterate through list of online users and emit to their sockets
            //req.app.onlineUsers from index.js
            const onlineUsers = req.app.onlineUsers
            const otherUsers = req.body.emails
            for(let i = 0; i<otherUsers.length; i++){
                // console.log(onlineUsers[otherUsers[i]])
                req.app.io.to(onlineUsers[otherUsers[i]]).emit('newConversation', newConversation)
            }
            res.send({conversation: newConversation})
        }
        else{
            //push message into existing convos message array
            existingConversation.messages.push(newMessage)
            await existingConversation.save()
            // console.log(existingConversation.messages)
            req.app.io.to(existingConversation._id).emit('newMessage', existingConversation)
            req.app.io.to(existingConversation._id).emit('existingConversation', existingConversation)
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
        // res.send({errors: ["An email provided is invalid."]})
        res.send({errors: [e]})
    }
})

router.post("/reactions", auth, async(req,res) => {
    const _id = req.body.message_id
    const user = req.user.email
    const reaction = req.body.reaction
    // console.log(Messages.reactions )
    // Messages.reactions.push(req.body.reaction)
    // Messages.reactions = []
    // await Messages.save()
    const associatedConversation = await Conversation.findById(req.body.conversation_id)
    const message = associatedConversation.messages.find(message => _id == message._id)
    let foundReaction = message.reactions.find(reaction => reaction.user === user)
    console.log(foundReaction)
    console.log(reaction)
    if(!foundReaction){
        message.reactions.push({
            user,
            reaction
        })
        foundReaction = {
            user,
            reaction
        }
    }
    else if(foundReaction.user === user && foundReaction.reaction !== reaction) {
        console.log('exists')
        // console.log(foundReaction.reaction)
        // console.log(reaction)
            const newArr = message.reactions.map(react => {
                if(react.user === user){
                    react.reaction = reaction
                //     return reaction
                // console.log(react)
                // console.log(reaction)
                }
                return react
            })
    //     console.log(foundReaction.reaction !== reaction)
    //     const index = message.reactions.findIndex(reaction => reaction.user === user)
    //     // console.log((message.reactions[index].reaction = reaction))
    //     // console.log(message.reactions[index].reaction)
    //     message.reactions[index].reaction = reaction 
            message.reactions = newArr
            // console.log(message.reactions)
    //     // for(let i = 0; i < message.reactions.length; i++){
    //     //     if(message.reactions[i].user === req.user.email){
    //     //         message.reactions[i].reaction = reaction
    //     //     }
    //     // }
    //     foundReaction.reaction = reaction
    }
    else if(foundReaction.reaction === req.body.reaction){
        // foundReaction.reaction = reaction
        message.reactions = message.reactions.filter(reaction => reaction.user !== req.user.email)
        // console.log("dashdilaushdasn", foundReaction)
    }
    // message.reactions = []
    await associatedConversation.save()
    // const Messages = await Message.findOne({_id})
    // console.log(Messages)
    // console.log(message)
    res.send(associatedConversation)
})

module.exports = router