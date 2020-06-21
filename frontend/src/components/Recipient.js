import React, {useState, useRef, useEffect, forwardRef, useLayoutEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addEmail,removeEmail} from '../actions/conversation'
import {setConversationError, emptyConversationError} from '../actions/errors'

export default forwardRef((props,ref) => {
    const myRef = useRef(null)
    const dispatch = useDispatch()
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    const conversationError = useSelector(state => state.errors.conversationError)
    
    const [recipient, setRecipient] = useState("")
    const [modal, setModal] = useState("")

    const emailRef = useRef(null)

    useEffect(() => {
        if(ref.current){
            ref.current.height = ref.current.offsetHeight
            props.setrecipientHeight(ref.current.height)
        }
    }, [myRef.current ? myRef.current.offsetHeight : null])

    useEffect(() => {
        emptyConversationError()
    }, [selectedConversation])

    const scrollToRef = () => {
        if(myRef.current){
            return myRef.current.scrollIntoView({ behavior: "smooth", block: 'end' })
        }
    }

    useEffect(() => {
            scrollToRef()
    }, [emails.length])

    useLayoutEffect(() => {
        const documentObj = document
        documentObj.addEventListener('click', closeModal)
        // debugger
        return () => {
            documentObj.removeEventListener('click', closeModal)
        }
    }, [modal])

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
                // setError("")
                dispatch(emptyConversationError())
                setRecipient("")
            }
            else{
                if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recipient)){  
                    dispatch(setConversationError("Email must be in right format (Ex. something@sample.com)"))
                }
          
                if(emails.includes(recipient)){    
                    dispatch(setConversationError("Email is included the list"))  
                }
               
                if(recipient === user.email){
                    dispatch(setConversationError("Email cannot be yours"))
                }
            }
        }
    }

    const handleEmailChange = (e) => {
        if(!e.target.value){
            dispatch(emptyConversationError())
        }
        setRecipient(e.target.value)
    }

    const handleModal = (email) => {
        if(modal === email){
            setModal("")
        }
        else{
            setModal(email)
        }
    }

    const closeModal = (e) => {
        if(modal && !emailRef.current.contains(e.target)){
            setModal("")
        }
    }

    return (
        <div ref={ref} className="recipient">
            <div className="recipient__errors-list">{conversationError}</div>
            <div className="recipient__email-list">
                <p>To:</p>
                {
                    emails.map(email => <div className="recipient__email" ref={emailRef} key={email}>
                        <div>{email}</div>
                        { 
                            <div className="recipient__dropdown-icon" 
                                onClick={
                                    noSelectedConversation() ? () => dispatch(removeEmail(email)) : () => handleModal(email)
                                }
                                >
                                {
                                    <i className={noSelectedConversation() ? "fas fa-times" : "fas fa-chevron-down"}></i>
                                }
                            </div>           
                        }
                        {
                            email === modal && <div className="recipient__modal">Open Modal</div>
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