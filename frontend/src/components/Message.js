import React from 'react'
import {useSelector} from 'react-redux'

export default ({users, message: {content, user}}) => {
    const loggedUser = useSelector(state => state.user)
    console.log(users)
    return (
        <div className="message-container">
            {
                user.email !== loggedUser.email && <div className="message__nametag">
                    {user.name}
                </div>
                
            }
            <div className={`message ${loggedUser.email === user.email ? "mine" : "other"}`}>
                {!user ? <img className="segment__typing" src="/image/typing_dots.gif"/> : content}
            </div>
        </div>
    )
}