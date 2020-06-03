import React, {useState, useLayoutEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {selectedConversation as selectConversationAction} from '../actions/conversation'

export default ({conversations,socket, conversation, conversation: {messages, users}}) => {
    const [typing, setTyping] = useState("")
    const user = useSelector(state => state.user)
    const selectConversation = useSelector(state => state.conversation.selectedConversation)

    // applies to all conversaton instances
    // why useLayoutEffect()? -> So React is attaching the socket event for the updated DOM before updated the screen. React will have to wait for this function to finish.
    useLayoutEffect(() => {
        setTyping("") //resets typing field since the order of conversations changes
        socket.emit('subscribeToConversation', conversation)
        socket.on('typing', ({selectedConversation,content}) => {

            //pass is an arg from server that includes the user name and conversation obj for comparison
            if(selectedConversation._id === conversation._id){

                //possible bugs: multiple user typing. One stops but might overwrite the other user still typing
                setTyping(content)
            }
        })
    
        return () => {
            socket.off('typing')
        }
    }, [conversations])

    const handleConversationSelect = () => {
        if(selectConversation._id !== conversation._id){
            // console.log('hello')
            //emits the event to remove this specific user from list of typers to other users' message container
            if(selectConversation){     
                const data = {selectedConversation:selectConversation,user,content:""}    
                socket.emit('typing', data)
                socket.emit('messageTyping', data)
            }
            dispatch(selectConversationAction(conversation))
        }
    }

    const checkIfSelected = () => {
        if(conversation._id === selectConversation._id){
            return "segment active"
        }
        return "segment"
    }

    const truncate = () => {
        const message = messages[messages.length-1].content
        let shortenedMsg = message.slice(0,18) 
        if(message.length > 18){
            return shortenedMsg + '...'
        }
        return shortenedMsg
    }
    //does not account if the conversation includes only the logged in user
    // const usersRefactored = () => {
    //     return users.filter(user => user.email !== loggedInUser.email)
    // }
    // const oneLineUsers = () => {
    //     return 
    // }
    const dispatch = useDispatch()
    return (
        <div className={checkIfSelected()} onClick={handleConversationSelect}>
            <div className="segment__notification">
                <img className="segment__notification-image" src="data:image/png;base64,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"/>
            </div>
            <div className="segment__info">
                <img className="segment__image" src="https://cdn2.vectorstock.com/i/1000x1000/01/66/businesswoman-character-avatar-icon-vector-12800166.jpg"/>
                <div className="segment__details">
                    <div className="segment__details-top">
                        <h3>{users[0].name}</h3>
                        <p>4:55 AM</p>
                    </div>
                    {
                        typing ? 
                        <img className="segment__typing" src={'/image/typing_dots.gif'}/>
                        :
                        <p>{truncate()}</p>
                    }
                   
                </div>
            </div>
        </div>
    )
}