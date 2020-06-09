import React, {useEffect, useState, useLayoutEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import moment from 'moment'
import Message from './Message'

import {selectedConversation as selectedConversationAction} from '../actions/conversation'
import {removeLoggedInUserFromConversation} from '../selectors/conversation'


// const typersInfo = {
    // structure:
    // conversation_id: [{
    //     user: {},
    //     content: ""
    // }, {
    //     user: {},
    //     content: ""
    // }]

    //Why separate object instead of useState? Asynchrony issue. Need a state that directly manipulated instead of waiting for a render trigger. 
// }

export default ({messageInputHeight, recipientHeight}) => {
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()

    const [typers, setTypers] = useState([])
    const [screen, setScreen] = useState(0)

    const messageRef = useRef(null)
    const bottom = useRef(null)
    const sortedMessagesByTime = useRef({})
    // react alternative to creating a mutable object
    // any errors, switch back to typersInfo object and change references below
    const typersInfo = useRef({})

    //these three methods are responsible for adjusting the height of the component
    //add an event listener on the window anytime it is resized accounting for the toggle device.
    useEffect(() => {
        window.addEventListener('resize', setScreenOrientation)
    }, [])

    // dynamically changes the components height 
    useLayoutEffect(() => {
        // console.log(messageInputHeight + recipientHeight)
        messageRef.current.style.height = (window.innerHeight - (messageInputHeight + recipientHeight)) + 'px'
    }, [messageInputHeight, recipientHeight, screen])
    
    const setScreenOrientation = (e) => {
        // console.log(e.target.innerHeight)
        setScreen(e.target.innerHeight)
    }

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
        if(typersInfo.current[selectConversation._id]){
            const names = typersInfo.current[selectConversation._id].map(obj => obj.user.name)
    
            setTypers(names)
        }
        else{
            //If it does not exist, no one is typing. Empty the typers array.
            setTypers([])
        }       
    }

    const scrollToRef = () => {
        return bottom.current.scrollIntoView({ behavior: "smooth" })
    }

    // useEffect(() => {
        //async solution to auto scroll for new message and switching convo.
        //might cause BUG. Not sure yet.
        // setTimeout(() => {
        //     scrollToRef()

        // }, 0)
    // }, [selectConversation])
  
    useEffect(() => {
        if(selectConversation.messages){
            organizeMessages(selectConversation.messages)
        }
        //Issues to Fix: Severe refactor. Unknown bug somewhere. At some point, when user switches conversation as another person is typing and goes back to same conversation, person typing doesn't register again.
        setTimeout(() => {
            scrollToRef()
        }, 0)
        //When the component reloads, check to see if typersInfo object was updated while viewing another conversation and update the typers.
        // console.log(typersInfo)
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
                if(!typersInfo.current[selectedConversation._id] && content){
                    //If it doesn't already exist, create it and set it into an array container an object with the user and content information
                    typersInfo.current[selectedConversation._id] = [
                        {
                            user,
                            content
                        }
                    ]
                }
                else if(typersInfo.current[selectedConversation._id] && !content){
                    //If content is blank, find the existing conversation and its array value in the typersInfo object, find the index of the object with the matching user. The goal is to remove just that object from the array.  
                    // debugger
                    const findIndex = typersInfo.current[selectedConversation._id].findIndex(obj => obj.user.name === user.name)

                    //There should always be a match but conditionally check if it returns something
                    if(findIndex > -1){
                        //Using .splice, remove that object from the array
                        typersInfo.current[selectedConversation._id].splice(findIndex,1)
                    }

                    //After removing the object from the array, check if the array is empty. If it is, delete that conversation from typersInfo object.
                    if(typersInfo.current[selectedConversation._id].length === 0){
                        delete typersInfo.current[selectedConversation._id]
                    }
                }
                else if(typersInfo.current[selectedConversation._id] && content){
                    //Otherwise, the conversation exists in the typersInfo object. Check to see if the typer is also in the array value. If found, replace their existing content value from the socket.
                    const existingTyper = typersInfo.current[selectedConversation._id].find(obj => obj.user.name === user.name)
                    if(existingTyper){
                        existingTyper.content = content
                    }
                    else{
                        //If the user is not in the array yet, add them to that array.
                        typersInfo.current[selectedConversation._id] = [
                            ...typersInfo.current[selectedConversation._id],
                            {
                                user,
                                content
                            }
                        ]
                    }
                }
                // debugger
                // console.log('after', typersInfo)
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
            sortedMessagesByTime.current = {}
            setTypers([])
            if(socket.io){
                //Everytime, selectConversation is changed, a typing socket listener is created.
                //on unmount, remove typing socket listener to prevent more listeners from being added.

                //Bug with this solution. Although it clears the typer on other sockets, Upon submission of new message, will empty out list of all typers

                // const data = {selectedConversation:selectConversation,user,content:""}
                // if(socket.on && selectConversation){         
                    // socket.emit('typing', data)
                    // socket.emit('messageTyping', data)
                // }
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

    const organizeMessages = (messages) => {
        let previousDate;
        for(let i = 0; i < messages.length; i++){
            if(!previousDate){
                previousDate = moment(messages[i].createdAt).format('L')
                sortedMessagesByTime.current[previousDate] = [{...messages[i]}]
            }else if(!moment(previousDate).isSame(messages[i].createdAt, 'day')){
                previousDate = moment(messages[i].createdAt).format('L')
                sortedMessagesByTime.current[previousDate] = [{...messages[i]}]
            }
            else if(sortedMessagesByTime.current[moment(messages[i].createdAt).format('L')]){
                sortedMessagesByTime.current[moment(messages[i].createdAt).format('L')] = [...sortedMessagesByTime.current[moment(messages[i].createdAt).format('L')], messages[i]]
            }
        }
        // messages.map(message => {
        //     if(!previousDate){
        //         previousDate = moment(message.createdAt).format('L')
        //         sortedMessagesByTime.current[previousDate] = [{...message}]
        //     }else if(!moment(previousDate).isSame(message.createdAt, 'day')){
        //         previousDate = moment(message.createdAt).format('L')
        //         sortedMessagesByTime.current[previousDate] = [{...message}]
        //     }
        //     else if(sortedMessagesByTime.current[moment(message.createdAt).format('L')]){
        //         sortedMessagesByTime.current[moment(message.createdAt).format('L')] = [...sortedMessagesByTime.current[moment(message.createdAt).format('L')], message]
        //     }
        // })
    }

    return (
        <div ref={messageRef} className="messages-container">
            <div className="messages-container__inner">
                <div className="messages-container__message">  
                    {
                       // selectConversation.messages && selectConversation.messages.map((message,index) => <Message key={message._id} message={message} users={selectConversation.users} prevConversation = {(index - 1) > -1 ? selectConversation.messages[index-1] : null}/>)
                       selectConversation.messages && Object.keys(sortedMessagesByTime.current).map(key => 
                        <div key={key} className="message_and_calendar">
                            <hr/>
                            <div key={key} className="message__calendar">
                                {moment(key).calendar({
                                    sameDay: '[Today]',
                                    nextDay: '[Tomorrow]',
                                    nextWeek: 'dddd',
                                    lastDay: '[Yesterday], MM/DD/YY',
                                    lastWeek: '[Last] dddd, MM/DD/YY',
                                    sameElse: 'MM/DD/YY'
                                })}
                            </div>
                            {
                                sortedMessagesByTime.current[key].map(message => <Message key={message._id} users={selectConversation.users} message={message}/>)
                            }
                        </div>
                       ) 
                    }
                    {
                        typers.length > 0 && <Message key={"typingMessageGif1234454455"} message={{content: "", user: false}}/>
                    }
                    <div ref={bottom}></div>
                </div>
                <div className="messages-typing__container">
                {
                    typers.length > 0 &&
                    <div className="messages-typing">
                        {
                            typers.length < 3 ?
                            typers.map((typer,index) => 
                            <span key={`${index+typer}`}>{typer}
                                {checkWhich(index + 1)} 
                            </span>)
                            :
                            <span>Several people</span>
                        }
                        {typers.length === 1 ? " is" : " are"} typing...
                    </div>
                }
                </div>
            </div>
        </div>
    )
}