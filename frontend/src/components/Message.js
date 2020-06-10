import React from 'react'
import moment from 'moment'
import {useSelector} from 'react-redux'

export default ({users=[], message: {content, user, createdAt, nextMessageUser}}) => {
    const loggedUser = useSelector(state => state.user)

    const check = () => {
        if(loggedUser.email === user.email){
            return `mine`
        }
        else{
            return `other`
        }
    }

    const checkIfLastMessage = () => {
        if(lastMessage()){
            return "last"
        }
        return ""
    }

    const lastMessage = () => {
        return !nextMessageUser || nextMessageUser.email !== user.email
    }

    const combinedClasses = () => {
        return `${check()} ${checkIfLastMessage()}`
    }

    return (
        <div className="message-container">  
            {
                users.length > 1 && user.email !== loggedUser.email && <div className="message__nametag">
                    {user.name}
                </div>  
            }
            <div className={`message ${combinedClasses()}`}>
                {!user ? <img className="segment__typing" src="/image/typing_dots.gif"/> : content}
            </div>
            {
                lastMessage() && <div className={`message__time ${combinedClasses()}`}>
                    {moment(createdAt).format('LT')}
                </div>  
            }
        </div>
    )
}