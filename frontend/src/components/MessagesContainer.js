import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Message from './Message'

import {selectedConversation as selectedConversationAction} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'

const obj = {

}

export default () => {
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const [typers, setTypers] = useState([])
    // const [otherTypers, setOtherTypers] = useState({})
    // console.log(otherTypers)
  
    useEffect(() => {
        //Issues to Fix: Severe refactor. Unknown bug somewhere. At some point, when user switches conversation as another person is typing and goes back to same conversation, person typing doesn't register again.
        if(obj[selectConversation._id]){
            setTypers(typers => {
                if(!typers.includes(obj[selectConversation._id].user.name) && obj[selectConversation._id].content){
                    return [...typers, obj[selectConversation._id].user.name]
                }
                else if(!obj[selectConversation._id].content){
                    const remove = typers.filter(typer => typer !==obj[selectConversation._id].user.name)
                    return remove
                }
                return typers
            })
        }
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
                if(selectedConversation._id === selectConversation._id){
                    // debugger
                    if(!obj[selectedConversation._id]){
                        obj[selectedConversation._id] = {
                            content,
                            user
                        }
                    }
                    else if(!content){
                        delete obj[selectedConversation._id]
                    }
                    else{
                        obj[selectedConversation._id] = {
                            ...obj[selectedConversation._id],
                            content
                        }
                    }
                    setTypers(typers => {
                        if(!typers.includes(user.name) && content){
                            return [...typers, user.name]
                        }
                        else if(!content){
                            const remove = typers.filter(typer => typer !==user.name)
                            return remove
                        }
                        return typers
                    })
                }

                else{
                    // console.log('something')
                    if(!obj[selectedConversation._id]){
                        obj[selectedConversation._id] = {
                            content,
                            user
                        }
                    }
                    else if(!content){
                        delete obj[selectedConversation._id]
                    }
                    else{
                        obj[selectedConversation._id] = {
                            ...obj[selectedConversation._id],
                            content
                        }
                    }
                    // console.log(obj)
                    // setOtherTypers({
                    //     ...typers,
                    //     [selectedConversation._id]: {
                    //         user,
                    //         content
                    //     }
                    // })
                }
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