import React, {forwardRef} from 'react'

import {truncateString} from '../selectors/conversation'

export default forwardRef(({userInfo: {email,phone,name, image_url}}, ref) => {

    const check = (string="", value=10) => {
        if(string){
            return truncateString(string,value)
        }
    }

    return (
        <div ref={ref} className={`recipient__modal ${email && "modal-active"}`}>
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
                    <div className="message__icon-icon">
                        <i className="fas fa-comment-dots"></i>
                    </div>

                    <div className="message__icon-name">
                        Message
                    </div>
                </div>

                <div className="icon-container">
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