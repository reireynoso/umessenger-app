import React, {useState, useRef, useEffect, forwardRef, useLayoutEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addEmail,removeEmail} from '../actions/conversation'
import {setConversationError, emptyConversationError} from '../actions/errors'

export default forwardRef((props,ref) => {
    const inputRef = useRef(null)
    const dispatch = useDispatch()
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    const conversationError = useSelector(state => state.errors.conversationError)
    
    const [recipient, setRecipient] = useState("")
    const [modal, setModal] = useState("")
    const [screen, setScreen] = useState(0)

    const modalRef = useRef(null)

    useLayoutEffect(() => {
        if(ref.current){
            ref.current.height = ref.current.offsetHeight
            props.setrecipientHeight(ref.current.height)
        }
    }, [emails.length, screen])

    useEffect(() => {
        emptyConversationError()
    }, [selectedConversation])

    useEffect(() => {
            scrollToRef()
    }, [emails.length])

    useEffect(() => {
        const documentObj = document
        documentObj.addEventListener('click', closeModal)
        return () => {
            documentObj.removeEventListener('click', closeModal)
        }
    }, [modal])

    useEffect(() => {
        const windowObj = window
        windowObj.addEventListener('resize', modalOrientation)

        return () => {
            windowObj.removeEventListener('resize', modalOrientation)
        }
    }, [])

    const scrollToRef = () => {
        if(inputRef.current){
            return inputRef.current.scrollIntoView({ behavior: "smooth", block: 'end' })
        }
    }

    const modalOrientation = (e) => {
        // console.log(modalRef.current.getBoundingClientRect())
        // if(modalRef.current.getBoundingClientRect().right === window.innerWidth){
        //     console.log('hey')
            // modalRef.current.style.right = 200 + "px"
            // modalRef.current.style.right = 0 + "px"
        //     modalRef.current.style.right = null
        //     modalRef.current.style.left = "0px"
        // }
        setScreen(e.target.innerWidth)
        setModal("")
    }

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

    const handleModal = (email, e) => {
        e.persist()
        const posY = e.clientY
        const posX = e.clientX
        if(modal === email){
            setModal("")
        }
        else{
            setModal(email)
            modalRef.current.style.top = posY + "px";
            //270 accounts for the width of the segment
            const width = posX - 270
            //300 accounts for the width of the modal element
            if((width + 300) > (window.innerWidth - 270)){
                modalRef.current.style.right = "0px"
                modalRef.current.style.left = null
            }
            else{
                modalRef.current.style.left = width + "px"
            }
        }
    }

    const closeModal = (e) => {
        if(modal && !modalRef.current.contains(e.target)){
            setModal("")
        }
    }

    return (
        <div ref={ref} className="recipient">
            <div className="recipient__errors-list">{conversationError}</div>
            <div className="recipient__email-list">
                <p>To:</p>
                {
                    emails.map(email => <div className={`recipient__email ${modal === email ? "active-email" : ""}`} key={email}>
                        <div>{email}</div>
                        { 
                            <div className={`recipient__dropdown-icon`}
                                onClick={
                                    noSelectedConversation() ? () => dispatch(removeEmail(email)) : (e) => handleModal(email, e)
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
                <div ref={modalRef} className={`recipient__modal ${modal && "modal-active"}`}>
                    <div className="recipient__modal-header">
                        <div className="image">
                            <img src="https://www.w3schools.com/howto/img_avatar.png"/>
                        </div>
                        <h1>Rei Rey;</h1>
                    </div>

                    <div className="recipient__modal-information">
                        <p>
                            <i className="far fa-envelope"></i>
                            &nbsp;cool@email.com
                        </p>
                        <p>
                            <i className="fas fa-phone"></i>
                            &nbsp;201-693-9999
                        </p>
                    </div>

                    <div className="recipient__modal-icons">
                        <div className="message__icon-container">
                            <div className="message__icon-icon">
                                <i className="fas fa-comment-dots"></i>
                            </div>

                            <div className="message__icon-name">
                                Message
                            </div>
                        </div>

                        <div className="video__icon-container">
                            <div className="message__icon-icon">
                                <i className="fas fa-video"></i>
                            </div> 

                            <div className="message__icon-name">
                                Video Chat
                            </div>
                        </div>
                    </div>
                </div>
                {
                    noSelectedConversation() && <input ref={inputRef} type="email" className="recipient__email-input" value={recipient} onKeyPress={handleKeyPress} onChange={handleEmailChange} placeholder={emails.length === 0 ? "No recipients": "Add recipient"}/>
                }
            </div>
        </div>
    )
})