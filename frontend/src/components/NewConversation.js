import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {sendMessageToConversation} from '../actions/conversation'

export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const conversations = useSelector(state => state.conversation)
    // focus on one convo user with number
    console.log(user)
    console.log(conversations)
    const [recipient, setRecipient] = useState("")
    const [content, setContent] = useState("")
    const [emails, setEmails] = useState([])

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

    const handleOnSubmit = (e) => {
        // e.preventDefault()
        if(e.key=== "Enter" && emails.length > 0){
            //make a fetch request to the backend to create new convo
           const res = dispatch(sendMessageToConversation(emails,content))
            if(res && res.errors){
                console.log(res.errors)
                // setErrors(res.errors)
            }
        }
        else{
            //please enters recipients error
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
                    emails.map(email => <div key={email}>
                        <p>{email}</p>
                        <button onClick={() => removeEmail(email)}>X</button>
                    </div>
                    )
                }
            </div>
            <div>
                <input type="email" value={recipient} onKeyPress={handleKeyPress} onChange={(e) => setRecipient(e.target.value)} placeholder="email"/>
                <input type="text" value={content} onKeyPress={handleOnSubmit} onChange={(e) => setContent(e.target.value)} placeholder="content"/>
            </div>    
        </div>
    )
}
