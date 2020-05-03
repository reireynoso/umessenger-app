export const setConversations = (conversations) => ({
    type: "SET_CONVERSATIONS",
    payload: conversations
})

export const sendMessageToConversation = (emails,content) => dispatch => {
    const token = localStorage.getItem("token")
    return fetch(`http://localhost:4000/conversations`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            emails,
            content
        })
    })
    .then(res => res.json())
    .then(console.log)
}