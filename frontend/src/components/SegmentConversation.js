import React from 'react'

export default ({conversation: {messages, users}}) => {
    const oneLineUsers = () => {
        return 
    }
    return (
        <div>
            <h3>{users[0].name}</h3>
            <p>{messages[messages.length-1].content}</p>
        </div>
    )
}