import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import SegmentConversation from './SegmentConversation'

export default () => {
    const conversations = useSelector(state => state.conversation.conversations)
    const socket = useSelector(state => state.socket)
    
    useEffect(() => {
        // console.log(Object.keys(socket))
        if(socket.io){
            socket.emit('viewConversation', () => {

            })
        }
        // socket.emit('join', () => {

        // })
    }, [socket])

    return (
        <div>
            <h2>Converations</h2>
            {
                conversations.map(conversation => <SegmentConversation conversation={conversation}/>)
            }
        </div>
    )
}