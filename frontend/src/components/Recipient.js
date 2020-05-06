import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addEmail,removeEmail} from '../actions/conversation'

export default () => {
    const dispatch = useDispatch()
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    
    const [recipient, setRecipient] = useState("")
    
    const handleKeyPress = (e) => {
        //email regex referenced from https://www.w3resource.com/javascript/form/email-validation.php
        //check if recipient is in the email format before adding it to the array of emails
        if(e.key === "Enter" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient) && !emails.includes(recipient) && (recipient !== user.email)){
            // console.log((recipient !== user.email))
            // setEmails(prevEmails => [...prevEmails, recipient])
            dispatch(addEmail(recipient))
            setRecipient("")
        }
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
                            noSelectedConversation() && <button onClick={() => dispatch(removeEmail(email))}>X</button>
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