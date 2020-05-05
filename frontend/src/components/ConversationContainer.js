import React, {useState, useEffect} from 'react'
import Recipient from './Recipient'
import {useSelector, useDispatch} from 'react-redux'
import {sendMessageToConversation} from '../actions/conversation'

export default () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    // focus on one convo user with number
    // console.log(user)
    // console.log(selectedConversation)
    
    const [content, setContent] = useState("")
    const [emails, setEmails] = useState([])

    useEffect(() => {
        console.log(selectedConversation)
        if(selectedConversation.users){
            const onlyEmails = selectedConversation.users.map(user => user.email)
            //avoids including current user in the list of emails. CONSIDER refactoring
            const onlyEmailsWithoutCurrentUser = onlyEmails.filter(email => email !== user.email)
            setEmails(onlyEmailsWithoutCurrentUser)
        }
        else{
            setEmails([])
        }
        
    }, [selectedConversation])

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
                <Recipient 
                    user={user} 
                    emails={emails} 
                    setEmails={setEmails}
                    selectedConversation={selectedConversation}
                />
            </div>
            <div>
                <input type="text" value={content} onKeyPress={handleOnSubmit} onChange={(e) => setContent(e.target.value)} placeholder="content"/>
            </div>    
        </div>
    )
}
