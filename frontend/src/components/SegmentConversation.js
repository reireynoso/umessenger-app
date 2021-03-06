import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import moment from 'moment'

import {selectedConversation as selectConversationAction} from '../actions/conversation'
import {truncateString} from '../selectors/conversation'

export default ({placement,socket, conversation, conversation: {messages, users, updatedAt}}) => {
    const dispatch = useDispatch()
    const [typing, setTyping] = useState("")
    const user = useSelector(state => state.user)
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    // console.log(moment(Date.now()).format('LT'))
    // applies to all conversaton instances
    // why useLayoutEffect()? -> So React is attaching the socket event for the updated DOM before updated the screen. React will have to wait for this function to finish.
    useEffect(() => {
        // setTyping("") //resets typing field since the order of conversations changes
        // console.log('new something')
        socket.emit('subscribeToConversation', conversation)
        socket.on('typing', handleTyping)
        return () => {
            // turns off event for specific callback instead of all events
            socket.off('typing', handleTyping)
        }
    }, [placement])

    const handleTyping =  ({selectedConversation,content}) => {
        //pass is an arg from server that includes the user name and conversation obj for comparison
        if(selectedConversation._id === conversation._id){

            //possible bugs: multiple user typing. One stops but might overwrite the other user still typing
            setTyping(content)
        }
    }

    const handleConversationSelect = () => {
        if(selectConversation._id !== conversation._id){
            //emits the event to remove this specific user from list of typers to other users' message container
            if(selectConversation){     
                const data = {selectedConversation:selectConversation,user,content:""}    
                socket.emit('typing', data)
                // socket.emit('messageTyping', data)
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

    const checkTime = () => {
        const today = Date.now()
        const sameDay = moment(updatedAt).isBefore(today, "day")
        const yesterday = moment(today).subtract(1, 'day')
        const checkIfYesterday = moment(updatedAt).isSame(yesterday, 'day')
      
        if(!sameDay){
            return moment(updatedAt).format('LT')
        }
        else if (checkIfYesterday){
            return "Yesterday"
        }
        else{
            return moment(updatedAt).format("MM/DD/YY")
        }
    }

    const userImage = (image) => {
        return image ? image : '/image/no-image.gif'
    }

    return (
        <div className={checkIfSelected()} onClick={handleConversationSelect}>
            <div className="segment__notification">
                <div className="segment__notification-image"/>
            </div>
            <div className="segment__info">
                {
                    users.length > 1 ? 
                    <div className="segment__image-container">
                        <img alt={`${users[0].name}`} className="segment__image multiple first"  src={userImage(users[0].image_url)}/>
                        <img alt={`${users[1].name}`} className="segment__image multiple second" src={userImage(users[1].image_url)}/>
                    </div> 
                    : 
                    <img alt={`${users[0].name}`} className="segment__image" src={userImage(users[0].image_url)}/>
                }
                <div className="segment__details">
                    <div className="segment__details-top">
                        <h3>{truncateString(users.map(user => user.name).join(', '),13)}</h3>
                        <p>{checkTime()}</p>
                    </div>
                    {
                        typing ? 
                        <img alt="typing-gif" className="segment__typing" src={'/image/typing_dots.gif'}/>
                        :
                        <p>{truncateString(messages[messages.length-1].content, 24)}</p>
                    }
                </div>
            </div>
        </div>
    )
}