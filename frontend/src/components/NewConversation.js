import React, {useState} from 'react'

export default () => {
    // focus on one convo user with number
    const [recipient, setRecipient] = useState("")
    const [message, setMessage] = useState("")

    const handleOnSubmit = (e) => {
        e.preventDefault()
        
    }
    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <input type="email" onChange={(e) => setRecipient(e.target.value)} placeholder="email"/>
                <textarea type="message" onChange={(e) => setMessage(e.target.value)} placeholder="message"/>
                <input type="submit"/>
            </form>
        </div>
    )
}
