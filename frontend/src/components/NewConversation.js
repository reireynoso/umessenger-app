import React, {useState} from 'react'
import {useSelector} from 'react-redux'

export default () => {
    const user = useSelector(state => state.user)
    // focus on one convo user with number
    console.log(user.email)
    const [recipient, setRecipient] = useState("")
    const [message, setMessage] = useState("")
    const [emails, setEmails] = useState([])

    console.log(emails)

    const handleKeyPress = (e) => {
        //email regex referenced from https://www.w3resource.com/javascript/form/email-validation.php
        //check if recipient is in the email format before adding it to the array of emails
        if(e.key === "Enter" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient) && !emails.includes(recipient) && (recipient !== user.email)){
            // console.log((recipient !== user.email))
            setEmails(prevEmails => [...prevEmails, recipient])
            setRecipient("")
        }
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        if(emails.length > 0){
            //make a fetch request to the backend to create new convo
        }
        else{
            //please enters recipients
        }
    }
    return (
        <div>
            <div>
            <h3>Recipients</h3>
                {
                    emails.length === 0 ?
                    <p>No recipients added</p>
                    :
                    emails.map(email => <p key={email}>{email}</p>)
                }
            </div>
            <form onSubmit={handleOnSubmit}>
                <input type="email" value={recipient} onKeyPress={handleKeyPress} onChange={(e) => setRecipient(e.target.value)} placeholder="email"/>
                <textarea type="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="message"/>
                <input type="submit"/>
            </form>
        </div>
    )
}
