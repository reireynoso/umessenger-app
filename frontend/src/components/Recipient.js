import React, {useState, useRef, useEffect, forwardRef, useLayoutEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {addEmail,removeEmail} from '../actions/conversation'
import {openRecipientModal,closeRecipientModal} from '../actions/modal'
import {setConversationError, emptyConversationError} from '../actions/errors'

import RecipientModal from './RecipientModal'

export default forwardRef((props,ref) => {
    const inputRef = useRef(null)
    const dispatch = useDispatch()
    const {recipientModal, userInformation} = useSelector(state => state.modal)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    const conversationError = useSelector(state => state.errors.conversationError)
    
    const [recipient, setRecipient] = useState("")
    // const [userInfo, setUserInfo] = useState({})
    // const [modal, setModal] = useState("")
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

    // useEffect(() => {
    //     const documentObj = document
    //     documentObj.addEventListener('click', closeModal)
    //     return () => {
    //         documentObj.removeEventListener('click', closeModal)
    //     }
    // }, [userInfo.email])

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
        // setModal("")
        // setUserInfo({})
        dispatch(closeRecipientModal())
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
        if(userInformation.email === email){
            // setModal("")
            // setUserInfo({})
            dispatch(closeRecipientModal())
        }
        else{
            // setModal(email)
            // console.log('different')
            // setUserInfo(userInformation(email))
            dispatch(openRecipientModal(findUserInformation(email)))
            // console.log('hit')
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

    // const closeModal = (e) => {
    //     if(e.target.className === "fas fa-chevron-down" || e.target.className === "recipient__dropdown-icon"){
    //         return 
    //     }
    //     else if(userInfo.email && !modalRef.current.contains(e.target)){
    //         // setModal("")
    //         // setUserInfo({})
    //         closeRecipientModal()
    //     }
    // }

    const findUserInformation = (email) => selectedConversation.users.find(user => user.email === email)

    return (
        <div ref={ref} className="recipient">
            <div className="recipient__errors-list">{conversationError}</div>
            <div className="recipient__email-list">
                <p>To:</p>
                {
                    emails.map(email => <div className={`recipient__email ${userInformation.email === email ? "active-email" : ""}`} key={email}>
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
                <RecipientModal 
                    ref={modalRef} 
                    // setUserInfo={}
                    // userInfo={userInfo}
                />
                {
                    noSelectedConversation() && <input ref={inputRef} type="email" className="recipient__email-input" value={recipient} onKeyPress={handleKeyPress} onChange={handleEmailChange} placeholder={emails.length === 0 ? "No recipients": "Add recipient"}/>
                }
            </div>
        </div>
    )
})