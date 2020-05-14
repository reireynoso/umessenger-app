import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Message from './Message'

import {selectedConversation as selectedConversationAction} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'

const obj = {

}

const typersInfo = {
    // conversation_id: [{
    //     user: {},
    //     content: ""
    // }, {
    //     user: {},
    //     content: ""
    // }]
}

export default () => {
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const [typers, setTypers] = useState([])
    // const [otherTypers, setOtherTypers] = useState({})
    // console.log(otherTypers)
    
    const handleTypers = () => {
        // setTypers(typers => {
        //     if(!typers.includes(obj[selectConversation._id].user.name) && obj[selectConversation._id].content){
        //         return [...typers, obj[selectConversation._id].user.name]
        //     }
        //     else if(!obj[selectConversation._id].content){
        //         const remove = typers.filter(typer => typer !==obj[selectConversation._id].user.name)
        //         return remove
        //     }
        //     return typers
        // })
        
        //checks to see if the selectConversation exists in typersInfo. If so, pull out the names of users from the array value and set it to the typers
        if(typersInfo[selectConversation._id]){
            const names = typersInfo[selectConversation._id].map(obj => obj.user.name)
    
            setTypers(names)
        }
        else{
            //If it does not exist, no one is typing. Empty the typers array.
            setTypers([])
        }
        
        
    }
  
    useEffect(() => {
        //Issues to Fix: Severe refactor. Unknown bug somewhere. At some point, when user switches conversation as another person is typing and goes back to same conversation, person typing doesn't register again.

        //When the component reloads, check to see if typersInfo object was updated while viewing another conversation and update the typers.
        handleTypers()
        // if(obj[selectConversation._id]){
            // setTypers(typers => {
            //     if(!typers.includes(obj[selectConversation._id].user.name) && obj[selectConversation._id].content){
            //         return [...typers, obj[selectConversation._id].user.name]
            //     }
            //     else if(!obj[selectConversation._id].content){
            //         const remove = typers.filter(typer => typer !==obj[selectConversation._id].user.name)
            //         return remove
            //     }
            //     return typers
            // })
            // handleTypers()
        // }
        if(socket.io){
            socket.on('newMessage', (conversation) => {
                // console.log('newMessage')
                //if a new message is sent from the server, socket emits the conversation is belongs to. Instead of everyone's viewing conversation being forced to switch to that updated conversation, only the users currently on that conversation is updated to the selectedConversation in state. 
                if(conversation._id === selectConversation._id){
                    //removes the current user from the conversation list before adding to the state
                    dispatch(selectedConversationAction(removeLoggedInUserFromConversation(conversation,user)))
                }

            })
            socket.on('messageTyping', ({user,content, selectedConversation}) => {

                // typers array keeps track of who's typing in conversation
                // anyone typing is added into the array as long they have something in content
                // if no content, user is removed from list of typers
                // if(!obj[selectedConversation._id]){
                //     obj[selectedConversation._id] = {
                //         content,
                //         user
                //     }
                // }
                // else if(!content){
                //     delete obj[selectedConversation._id]
                // }
                // else{
                //     obj[selectedConversation._id] = {
                //         ...obj[selectedConversation._id],
                //         content
                //     }
                // }

                // As a user is typing, we store the conversation id they're typing from as a key into the typersInfo object. 
                if(!typersInfo[selectedConversation._id]){
                    //If it doesn't already exist, create it and set it into an array container an object with the user and content information
                    typersInfo[selectedConversation._id] = [
                        {
                            user,
                            content
                        }
                    ]
                }
                else if(!content){
                    //If content is blank, find the existing conversation and its array value in the typersInfo object, find the index of the object with the matching user. The goal is to remove just that object from the array.  
                    const findIndex = typersInfo[selectedConversation._id].findIndex(obj => obj.user.name === user.name)

                    //There should always be a match but conditionally check if it returns something
                    if(findIndex > -1){
                        //Using .splice, remove that object from the array
                        typersInfo[selectedConversation._id].splice(findIndex,1)
                    }

                    //After removing the object from the array, check if the array is empty. If it is, delete that conversation from typersInfo object.
                    if(typersInfo[selectedConversation._id].length === 0){
                        delete typersInfo[selectedConversation._id]
                    }
                }
                else{
                    //Otherwise, the conversation exists in the typersInfo object. Check to see if the typer is also in the array value. If found, replace their existing content value from the socket.
                    const existingTyper = typersInfo[selectedConversation._id].find(obj => obj.user.name === user.name)
                    if(existingTyper){
                        existingTyper.content = content
                    }
                    else{
                        //If the user is not in the array yet, add them to that array.
                        typersInfo[selectedConversation._id] = [
                            ...typersInfo[selectedConversation._id],
                            {
                                user,
                                content
                            }
                        ]
                    }
                }
               
                //Update the list of typers after the typersInfo changes from the socket event.
                handleTypers()
                
                //keeps track of typers as they're typing
                // if(selectedConversation._id === selectConversation._id){
                    // setTypers(typers => {
                    //     if(!typers.includes(user.name) && content){
                    //         return [...typers, user.name]
                    //     }
                    //     else if(!content){
                    //         const remove = typers.filter(typer => typer !==user.name)
                    //         return remove
                    //     }
                    //     return typers
                    // })
                    // if(obj[selectConversation._id]){
                    //     handleTypers()
                    // }
                // }
            })
        }

        return () => {
            //empties out typers if conversation is switched
            setTypers([])
            if(socket.io){
                //Everytime, selectConversation is changed, a typing socket listener is created.
                //on unmount, remove typing socket listener to prevent more listeners from being added.
                socket.off('messageTyping')
                socket.off('newMessage')
            }
        }
    }, [selectConversation])

    const checkWhich = (index) => {
        //index passed in accounts for the 0. 1 is added already
        if(typers.length === 1 || index === typers.length){ 
            return " "
        }
        else if(index + 1 === typers.length){ //compares next number to length
            return ", and "
        }
        else{
            return ", "
        }
    }

    return (
        <div>
            <h1>Messages</h1>
            {
                selectConversation.messages && selectConversation.messages.map(message => <Message message={message}/>)
            }
            {
                typers.length > 0 &&
                <div>
                    {
                        typers.map((typer,index) => 
                        <span key={`${index+typer}`}>{typer}
                            {checkWhich(index + 1)} 
                        </span>)
                    }
                    {typers.length === 1 ? "is" : "are"} typing...
                </div>
            }
        </div>
    )
}