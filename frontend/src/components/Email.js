import React, {useState} from 'react'
import {useDispatch} from 'react-redux'

export default ({email,removeEmail,noSelectedConversation}) => {
    const [modal, setModal] = useState(false)
    const dispatch = useDispatch()
    return (
        <div className="recipient__email">
            <div>{email}</div>
            { 
                <div className="recipient__dropdown-icon" 
                    onClick={
                        noSelectedConversation() ? () => dispatch(removeEmail(email)) : () => setModal(!modal)
                    }
                    >
                    {
                        <i className={noSelectedConversation() ? "fas fa-times" : "fas fa-chevron-down"}></i>
                    }
                </div>           
            }
            {
                modal && <div className="recipient__modal">Open Modal</div>
            }   
        </div>
    )
}