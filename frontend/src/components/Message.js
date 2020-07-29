import React, {useState, useEffect} from 'react'
import moment from 'moment'
import {useSelector, useDispatch} from 'react-redux'
// import apiUrl from '../utils/apiUrl'
import {sendReactionRequest} from '../actions/conversation'

export default ({users=[], message: {_id,content, reactions, user, createdAt, nextMessageUser}, blurOutComponent, blurred}) => {
    const dispatch = useDispatch()
    const loggedUser = useSelector(state => state.user)
    const selectConversation = useSelector(state => state.conversation.selectedConversation)
    
    const [startLongPress, setStartLongPress] = useState(false)

    useEffect(() => {
        let timerId;
        if(startLongPress){
            timerId = setTimeout(() => {
                blurOutComponent(_id)
            }, 1000)
        }
        else{
            clearTimeout(timerId)
        }

        return ()=> {
            clearTimeout(timerId)
        }
    }, [startLongPress])

    useEffect(() => {
        console.log(reactions)
    }, [blurred])

    const giveReaction = (reaction) => {
        //handle fetch to express to create reaction
        //consider creating array property on message object instead of model
        // console.log(loggedUser)
        
        const reactionObj = {
            conversation_id: selectConversation._id,
            message_id: _id,
            reaction
        }

        dispatch(sendReactionRequest(reactionObj, loggedUser))

        // const token = localStorage.getItem("token")
        // return fetch(`${apiUrl}/reactions`, {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': "application/json",
        //         'Authorization': `Bearer ${token}`
        //     },
        //     body: JSON.stringify(reactionRequest)
        // })
        // .then(res => {
        //     if(res.status === 400){
        //         return console.log('error')
        //     }
        //     return res.json()
        // })
        // .then(data => {
        //     if(data){
        //         console.log(data)   
        //     }
        // })
    }

    const checkIfMineOrOther = () => loggedUser.email === user.email ? "mine" : "other"

    const checkIfLastMessage = () => lastMessage() ? "last" : ""

    const lastMessage = () => !nextMessageUser || nextMessageUser.email !== user.email

    const checkIfMineAndLast = () => `${checkIfMineOrOther()} ${checkIfLastMessage()}`

    return (
        <div className={`message-container`}
            onMouseDown={() => setStartLongPress(true)}
            onMouseUp={() => setStartLongPress(false)}
            onMouseLeave={() => setStartLongPress(false)}
            >  
            {
                users.length > 1 && user.email !== loggedUser.email && <div className="message__nametag">
                    {user.name}
                </div>  
            }
            <div className={`message ${blurred === _id ? "no-blurred" : ""} ${checkIfMineAndLast()}`}>
                <div className={`popup ${checkIfMineAndLast()} ${blurred === _id ? "show-popup" : ""}`}>
                    <div className="message__reaction-container">
                        <span onClick={() => giveReaction("thumbs-up")}><i className="fas fa-thumbs-up fa-lg"></i></span>
                        <span onClick={() => giveReaction("thumbs-down")}><i className="fas fa-thumbs-down fa-lg"></i></span>
                        <span onClick={() => giveReaction("exclamation")}><i className="fas fa-exclamation fa-lg"></i></span>
                        <span onClick={() => giveReaction("question")}><i className="fas fa-question fa-lg"></i></span>
                    </div>
                </div>
                {!user ? <img alt="typing-gif" className="segment__typing" src="/image/typing_dots.gif"/> : content}
                <div className={`message__tooltip ${checkIfMineOrOther()}`}>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
            </div>
            {
                lastMessage() && <div className={`message__time ${checkIfMineAndLast()}`}>
                    {moment(createdAt).format('LT')}
                </div>  
            }
        </div>
    )
}