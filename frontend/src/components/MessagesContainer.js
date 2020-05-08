import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import Message from './Message'

export default () => {
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const socket = useSelector(state => state.socket)
    
    useEffect(() => {
        if(socket.on){
            socket.on('typing', (input) => {
                console.log(input)
                console.log(selectedConversation)
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