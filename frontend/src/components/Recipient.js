import React, {useState, useRef, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addEmail,removeEmail} from '../actions/conversation'

export default () => {
    const myRef = useRef(null)
    const dispatch = useDispatch()
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    
    const [recipient, setRecipient] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(false)
    }, [selectedConversation])

    //check whether a conversation is selected.
    //if not selected, able to remove and add recipients
    const noSelectedConversation = () => !selectedConversation.users
    
    const handleKeyPress = (e) => {
        //email regex referenced from https://www.w3resource.com/javascript/form/email-validation.php
        //check if recipient is in the email format before adding it to the array of emails
        if(e.key === "Enter" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient) && !emails.includes(recipient) && (recipient !== user.email)){
            // console.log((recipient !== user.email))
            // setEmails(prevEmails => [...prevEmails, recipient])
            dispatch(addEmail(recipient))
            scrollToRef()
            setError(false)
            setRecipient("")
        }
        else{
            setError(true)
        }
    }

    const handleEmailChange = (e) => {
        if(!e.target.value){
            setError(false)
        }
        setRecipient(e.target.value)
    }

    const scrollToRef = () => {
        return myRef.current.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="recipient">
            <div className="recipient__errors-list">{error && "Please write email in the right format"}</div>
            <div className="recipient__email-list">
                <p>To:</p>
                {
                    emails.map(email => <div className="recipient__email" key={email}>
                        <div>{email}</div>
                        { 
                            <div className="recipient__dropdown-icon" 
                                onClick={
                                    noSelectedConversation() ? () => dispatch(removeEmail(email)) : null
                                }
                                >
                                {
                                    <i className={noSelectedConversation() ? "fas fa-times" : "fas fa-chevron-down"}></i>
                                }
                            </div>           
                        }
                    </div>
                    )
                
                }
                {
                    noSelectedConversation() && <input ref={myRef} type="email" className="recipient__email-input" value={recipient} onKeyPress={handleKeyPress} onChange={handleEmailChange} placeholder={emails.length === 0 ? "No recipients": "Add recipient"}/>
                }
            </div>
        </div>
    )
}