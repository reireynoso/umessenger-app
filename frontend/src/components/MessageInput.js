import React, {useState,useEffect,useRef, forwardRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {sendMessageToConversation} from '../actions/conversation'

export default forwardRef((props,ref) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const emails = useSelector(state => state.conversation.emails)
    const selectedConversation = useSelector(state => state.conversation.selectedConversation)
    
    const textArea = useRef()

    const [content, setContent] = useState("")

    const socket = useSelector(state => state.socket)

    useEffect(() => {
        if(ref.current){
            ref.current.height = ref.current.offsetHeight
            props.setmessageInputHeight(ref.current.height)
        }
    }, [textArea.current ? textArea.current.offsetHeight : null])

    useEffect(() => {
        if(textArea.current){
            textArea.current.focus()
        }
        setContent("")
    },[selectedConversation._id])

    const handleResetInput = () =>{
        const data = {selectedConversation,user,content:""}
        if(socket.on && selectedConversation){         
            socket.emit('typing', data)
            socket.emit('messageTyping', data)
        }
        setContent("")
    }
    
    const handleOnChange = (e) => {
        //always resets height to 2rem
        
        textArea.current.style.height = '20px';
        //grabs the scrollHeight from that initial height of 2rem and assigns to new accounting for the extra 2px
        textArea.current.style.height = (textArea.current.scrollHeight - 2) + 'px'
        if(textArea.current.value.trim() === ""){
            textArea.current.value = ""
            textArea.current.style.height = '20px'
        }
        const data = {selectedConversation,user,content:e.target.value}
        if(socket.on && selectedConversation){
            socket.emit('typing', data)
            socket.emit('messageTyping', data)
        }
        setContent(e.target.value)
    }
    
    const handleOnSubmit = async(e) => {     
        if(e.key=== "Enter" && emails.length > 0){
            //make a fetch request to the backend to create new convo
        //  debugger
            
            handleResetInput()
            // console.log(textArea.current.value)
            // const errors = await dispatch(sendMessageToConversation(emails,content,user))
            // if(errors){
            //     console.log(errors)
            // }
                
        }

        else{
            //please enters recipients error
        }
    }
    return(
        <div ref={ref} className="content">
            <textarea ref={textArea} type="text" className="content__input" value={content} onKeyPress={handleOnSubmit} onChange={handleOnChange} placeholder="uMessage..."/>
        </div>    
    )
})