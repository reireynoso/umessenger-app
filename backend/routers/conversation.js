const express = require('express')
const router = new express.Router()
// const cors = require('cors')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Conversation = require('../models/conversation')

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
    // const {conversation_id, message_id, reaction} = req.body
    // const user = req.user.email
    // const reactionObj = {
    //     user,
    //     reaction
    // }

    const {conversation_id, message_id, reaction} = req.body
    const user = req.user.email
    // const reactionObj = {
    //     user,
    //     reaction
    // }

    try{
        // const associatedConversation = await Conversation.findById(conversation_id).populate('messages.user')
        // const message = associatedConversation.messages.find(message => message_id == message._id)
        // // console.log(message)
        // const foundReaction = message.reactions.find(reaction => reaction.user === user)
        // // console.log('before', associatedConversation.messages[0])
    
        // // checks if user already made a reaction on this message
        // if(!foundReaction){
        //     message.reactions.push(reactionObj)
        // }
        // // if(foundReaction && foundReaction.reaction === req.body.reaction){
        // //     message.reactions = message.reactions.filter(reaction => reaction.user !== req.user.email)
        // // }

        // // if(foundReaction && foundReaction.user === user && foundReaction.reaction !== reaction) {
        // //     console.log('exists')
        // //         const newArr = message.reactions.map(react => {
        // //             if(react.user === user){
        // //                 react.reaction = reaction
        // //             }
        // //             return react
        // //         })

        // //         message.reactions = newArr

        // //         //not reassigning as we hope
        // //         // message.reactions = newArr
        // //         // console.log('new', newArr)
        // // }
        // else {
        //     // check if the user passed in same reaction to "unlike"
        //     if(foundReaction.reaction === req.body.reaction){
        //         message.reactions = message.reactions.filter(reaction => reaction.user !== user)
        //     }

        //     // user can only have one reaction. if already has one, "update" the reaction
        //     if(foundReaction.user === user && foundReaction.reaction !== reaction) {
        //             // why doesn't this approach work? I.e save to the database?
        //             message.reactions = message.reactions.map(react => {
        //                 if(react.user === user){
        //                     react.reaction = reaction
        //                 }
        //                 return react
        //             })

        //             // Why does these approach work?

        //             // remove existing user's array and then push in new reaction
        //             // message.reactions = message.reactions.filter(reaction => reaction.user !== req.user.email)
        //             // message.reactions.push({
        //             //     user,
        //             //     reaction
        //             // })

        //             // find index of existing user's reaction in array and replace it with new passed in
        //             // const findIndex = message.reactions.findIndex(react =>  react.user === user)
        //             // message.reactions.splice(findIndex, 1, reactionObj)

        //     }
        // }

        const associatedConversation = await Conversation.findById(conversation_id).populate('messages.user')
        const message = associatedConversation.messages.find(message => message_id == message._id)
        const foundReaction = message.reactions

        let sameReaction;

        const reactionKeys = Object.keys(message.reactions)
            // goes through each reaction key and iterates through the array to remove previous reactions made by the user
        if(reactionKeys.length){
            for(let i = 0; i < reactionKeys.length; i++){
                // check if the value array contains the name. If it does, remove the user from the array
                if(foundReaction[reactionKeys[i]].includes(user)){
                    // console.log('yo',reactionKeys[i])
                    sameReaction = reactionKeys[i]
                    const remove = foundReaction[reactionKeys[i]].filter(userObj => userObj !== user)
                    
                    if(remove.length !== 0){
                        foundReaction[reactionKeys[i]] = remove
                    }
                    // if empty array, remove the key of reaction
                    else{
                        delete foundReaction[reactionKeys[i]]
                    }
                }
            }
        }

        // as long as the reaction isn't the same the previous made before
        if(reaction !== sameReaction){
            // checks if a reaction has been made already.
            if(foundReaction[reaction]){
                // check if a user made the reaction already
                // const found = foundReaction[reaction].find(userObj => userObj === user)
                // if none found, add them to the array
                // if(!found){
                    foundReaction[reaction].push(user)
                // }
                // if found, they're unliking the reaction
                // else{
                    // const remove = foundReaction[reaction].filter(userObj => userObj !== user)
                    // if the filtered array is not empty, filter out the specific user that unliked
                    // if(remove.length !== 0){
                        // foundReaction[reaction] = remove
                    // }
                    // if empty array, remove the key of reaction
                    // else{
                        // delete foundReaction[reaction]
                    // }
                // }
            }
            // checks if user already made a reaction on this message
            else{
                foundReaction[reaction] = [user]
            }
        }
        // message.reactions = {}
        // this notifies MongoDB that the property has changed to save
        associatedConversation.markModified('messages')
        await associatedConversation.save()
        // console.log('after', associatedConversation.messages[0])
        req.app.io.to(conversation_id).emit('reactionUpdated', associatedConversation)
        // res.status(201).send({conversation: associatedConversation})
        res.status(201).send()
    }catch(e){
        console.log(e)
        res.status(400).send({errors: [e]})
    }

})

module.exports = router