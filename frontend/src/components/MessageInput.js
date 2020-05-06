import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {sendMessageToConversation} from '../actions/conversation'

export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    
    const [content, setContent] = useState("")
    
    const handleOnSubmit = async(e) => {     
        if(e.key=== "Enter" && emails.length > 0){
            //make a fetch request to the backend to create new convo
           const errors = await dispatch(sendMessageToConversation(emails,content,user))
            if(errors){
                console.log(errors)
            }
        }
        else{
            //please enters recipients error
        }
    }
    return(
        <div>
            <input type="text" value={content} onKeyPress={handleOnSubmit} onChange={(e) => setContent(e.target.value)} placeholder="content"/>
        </div>    
    )
}