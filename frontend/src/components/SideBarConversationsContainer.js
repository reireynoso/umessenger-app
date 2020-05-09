import React, {useEffect} from 'react'
import {useSelector} from 'react-redux'
import SegmentConversation from './SegmentConversation'

export default () => {
    // const socket = useSelector(state => state.socket)
    const conversations = useSelector(state => state.conversation.conversations)
    // useEffect(() => {
    //     // console.log('select')
    //     // console.log(selectConversation)
    //     if(socket.io){
    //         // console.log(users)
    //         for(let i = 0; i<conversations.length; i++){
    //             socket.emit('subscribeToConversation', conversations[i])
    //         }
    //     }
    //     return () => {
    //         // if(socket.on){
    //         //     socket.emit('disconnect')
    //         //     socket.off()
    //         // }
    //         console.log('something')
    //     }
    // }, [conversations])
    return (
        <div>
            <h2>Converations</h2>
            {
                conversations.map(conversation => <SegmentConversation conversation={conversation}/>)
            }
        </div>
    )
}