import React from 'react'

export default ({message, message: {content}}) => {
    console.log(message)
    return (
        <div>
           {content}
        </div>
    )
}