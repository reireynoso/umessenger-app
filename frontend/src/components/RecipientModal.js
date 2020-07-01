import React, {forwardRef, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {truncateString} from '../selectors/conversation'
import {removeSelectedConversation} from '../actions/conversation'
import {closeRecipientModal} from '../actions/modal'
import {openVideoModal} from '../actions/modal'

export default forwardRef((props, ref) => {

    const {recipientModal, userInformation: {email,phone,name,image_url}} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    useEffect(() => {
        const documentObj = document
        documentObj.addEventListener('click', closeModal)
        return () => {
            documentObj.removeEventListener('click', closeModal)
        }
    }, [recipientModal])

    const check = (string="", value=10) => {
        if(string){
            return truncateString(string,value)
        }
    }

    const closeModal = (e) => {
        // Good react practice?
        const videoModal = e.target.closest(".video-modal__container")
        if(e.target.className === "fas fa-chevron-down" || e.target.className === "recipient__dropdown-icon" ){
            return 
        }
        // avoids clearing out userInformation when clicking on the Video Modal component
        else if(videoModal && videoModal.className === "video-modal__container"){
            // if(e.target.className === "fas fa-phone-slash" || e.target.className === "leave" || e.target.className === "close"){
            //     return
            // }
            return
        }
        else if(email && !ref.current.contains(e.target)){
            // setModal("")
            // setUserInfo({})
            
            dispatch(closeRecipientModal())
        }
    }

    return (
        <div ref={ref} className={`recipient__modal ${recipientModal ? "modal-active" : ""}`}>
            <div className="recipient__modal-header">
                <div className="image">
                    <img src={image_url ? image_url : "/image/no-image.gif"}/>
                </div>
                <h1>{check(name, 80)}</h1>
            </div>

            <div className="recipient__modal-information">
                <p>
                    <i className="far fa-envelope"></i>
                    &nbsp;{check(email, 24)}
                </p>
                <p>
                    <i className="fas fa-phone"></i>
                    &nbsp;{phone}
                </p>
            </div>

            <div className="recipient__modal-icons">
                <div className="icon-container">
                    <div className="message__icon-icon" onClick={() => {
                        dispatch(closeRecipientModal())
                        dispatch(removeSelectedConversation(email))
                    }}>
                        <i className="fas fa-comment-dots"></i>
                    </div>

                    <div className="message__icon-name">
                        Message
                    </div>
                </div>

                <div className="icon-container" onClick={() => dispatch(openVideoModal())}>
                    <div className="message__icon-icon">
                        <i className="fas fa-video"></i>
                    </div> 

                    <div className="message__icon-name">
                        Video Chat
                    </div>
                </div>
            </div>
        </div>
    )
})