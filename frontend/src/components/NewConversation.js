import React, {useState} from 'react'
import Recipient from './Recipient'
import {useSelector, useDispatch} from 'react-redux'
import {sendMessageToConversation} from '../actions/conversation'

export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const conversations = useSelector(state => state.conversation)
    // focus on one convo user with number
    console.log(user)
    console.log(conversations)
    
    const [content, setContent] = useState("")
    const [emails, setEmails] = useState([])

    // console.log(emails)


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
                <Recipient user={user} emails={emails} setEmails={setEmails}/>
            </div>
            <div>
               
                <input type="text" value={content} onKeyPress={handleOnSubmit} onChange={(e) => setContent(e.target.value)} placeholder="content"/>
            </div>    
        </div>
    )
}
