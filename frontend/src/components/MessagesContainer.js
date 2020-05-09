import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Message from './Message'

export default () => {
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const socket = useSelector(state => state.socket)

    const [typers, setTypers] = useState([])
    console.log(typers)
    useEffect(() => {
        // console.log(selectedConversation._id)
        if(socket.on){
            socket.on('typing', ({user,content}) => {
                // typers array keeps track of who's typing in conversation
                // anyone typing is added into the array as long they have something in content
                // if no content, user is removed from list of typers
                setTypers(typers => {
                    if(!typers.includes(user.name)){
                        return [...typers, user.name]
                    }
                    else if(!content){
                        const remove = typers.filter(typer => typer !==user.name)
                        return remove
                    }
                    return typers
                })
            })
        }

        return () => {
            if(socket.on){
                socket.emit('disconnect')
                socket.off()
            }
        }
    }, [selectedConversation])

    return (
        <div>
            <h1>Messages</h1>
            {
                selectedConversation.messages && selectedConversation.messages.map(message => <Message message={message}/>)
            }
        </div>
    )
}