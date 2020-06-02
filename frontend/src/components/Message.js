import React from 'react'
import {useSelector} from 'react-redux'

export default ({message: {content, user}}) => {
    const loggedUser = useSelector(state => state.user)
    // console.log(message)
    return (
        <div className="message-container">
            <div className={`message ${loggedUser.email === user.email ? "mine" : "other"}`}>
                {content}
            </div>
        </div>
    )
}