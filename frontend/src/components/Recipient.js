import React, {useState, useRef, useEffect, forwardRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addEmail,removeEmail} from '../actions/conversation'

export default forwardRef((props,ref) => {
    const myRef = useRef(null)
    const dispatch = useDispatch()
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    
    const [recipient, setRecipient] = useState("")
    const [error, setError] = useState([])
    // 

    useEffect(() => {
        if(ref.current){
            ref.current.height = ref.current.offsetHeight
            props.setrecipientHeight(ref.current.height)
        }
    }, [myRef.current ? myRef.current.offsetHeight : null])

    useEffect(() => {
        setError("")
    }, [selectedConversation])

    const scrollToRef = () => {
        if(myRef.current){
            return myRef.current.scrollIntoView({ behavior: "smooth", block: 'end' })
        }
    }

    useEffect(() => {
        // if(myRef.current){
            scrollToRef()
        // }
    }, [emails.length])

    //check whether a conversation is selected.
    //if not selected, able to remove and add recipients
    const noSelectedConversation = () => !selectedConversation.users
    
    const handleKeyPress = (e) => {
        //email regex referenced from https://www.w3resource.com/javascript/form/email-validation.php
        //check if recipient is in the email format before adding it to the array of emails
        if(e.key === "Enter"){
            // console.log((recipient !== user.email))
            // setEmails(prevEmails => [...prevEmails, recipient])
            if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient) && !emails.includes(recipient) && (recipient !== user.email)){
                dispatch(addEmail(recipient))
                setError("")
                setRecipient("")

                // console.log(error)
            }
            else{
                if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient)){  
                    setError("Email must be in right format (Ex. something@sample.com)")
                }
          
                if(emails.includes(recipient)){    
                    setError("Email is included the list")  
                }
               
                if(recipient === user.email){
                    setError("Email cannot be yours")
                }

            }
        }
    }

    const handleEmailChange = (e) => {
        if(!e.target.value){
            setError("")
        }
        setRecipient(e.target.value)
    }

    return (
        <div ref={ref} className="recipient">
            <div className="recipient__errors-list">{error}</div>
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
})