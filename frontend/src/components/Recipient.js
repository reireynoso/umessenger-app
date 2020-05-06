import React, {useState} from 'react'
// import {useSelector} from 'react-redux'

export default ({user, emails, setEmails, selectedConversation}) => {
    const [recipient, setRecipient] = useState("")
    // const [emails, setEmails] = useState([])
    // console.log(emails)
    const handleKeyPress = (e) => {
        //email regex referenced from https://www.w3resource.com/javascript/form/email-validation.php
        //check if recipient is in the email format before adding it to the array of emails
        if(e.key === "Enter" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient) && !emails.includes(recipient) && (recipient !== user.email)){
            // console.log((recipient !== user.email))
            setEmails(prevEmails => [...prevEmails, recipient])
            setRecipient("")
        }
    }

    const removeEmail = (removeEmail) => {
        const removedEmail = emails.filter(email => email !== removeEmail)
        setEmails(removedEmail)
    }

    //check whether a conversation is selected.
    //if not selected, able to remove and add recipients
    const noSelectedConversation = () => !selectedConversation.users
    
    return (
        <div>
             <h3>Recipients</h3>
             <div style={{display: "flex"}}>
                {
                    emails.map(email => <div key={email}>
                        <span>{email}</span>
                        {
                            noSelectedConversation() && <button onClick={() => removeEmail(email)}>X</button>
                        }
                    </div>
                    )
                }
                {
                    noSelectedConversation() && <input type="email" value={recipient} onKeyPress={handleKeyPress} onChange={(e) => setRecipient(e.target.value)} placeholder="email"/>
                }
             </div>
        </div>
    )
}