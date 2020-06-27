import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {closeVideoModal} from '../actions/modal'

export default () => {
    const videoModal = useSelector(state => state.modal.videoModal)
    const user = useSelector(state => state.user)
    const modalUser = useSelector(state => state.modal.userInformation)
    const dispatch = useDispatch()
    
    return (
        <div className={`video-modal__container ${videoModal ? "open" : ""}`}>
            <div className="video-modal__top-bar">
                <span onClick={() => dispatch(closeVideoModal())} className="close">X</span>
                <div className="video-modal__my-video-container">
                    <div className="video">
                        
                        <span className="name">{user.name}</span>
                    </div>
                </div>
            </div>

            <div className="video-modal__main-bar">
                <div className="video">
                    
                    <div className="name">{modalUser.name}</div>
                </div>
            </div>

            <div className="video-modal__bottom-bar">
                <div className="leave">
                <i className="fas fa-phone-slash"></i> &nbsp;End Call
                </div>
            </div>
        </div>
    )
}