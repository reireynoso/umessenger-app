import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Message from './Message'

export default () => {
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    const socket = useSelector(state => state.socket)

    const [typers, setTypers] = useState([])
    // console.log(typers)
    useEffect(() => {
        // console.log(selectedConversation._id)
        if(socket.on){
            socket.on('typing', ({user,content, selectedConversation}) => {
                // typers array keeps track of who's typing in conversation
                // anyone typing is added into the array as long they have something in content
                // if no content, user is removed from list of typers
                if(selectedConversation._id === selectConversation._id){
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
            })
        }

        return () => {
            // if(socket.on){
            //     socket.emit('disconnect')
            //     socket.off()
            // }
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