const formatConversation = (conversation, userObj) => {
    const removedUser = conversation.users.filter(user => user.email !== userObj.email)
    const formattedConversation = {
        ...conversation,
        users: removedUser
    }
    return formattedConversation
}

export const removeLoggedInUserFromConversation = (data,userObj) => {
    // console.log(Array.isArray(data))
    // console.log(userObj)
    // console.log(data)
    if(Array.isArray(data)){
        return data.map(conversation => {
            // const removedUser = conversation.users.filter(user => user.email !== userObj.email)
            // const formattedConversation = {
            //     ...conversation,
            //     users: removedUser
            // }
            return formatConversation(conversation,userObj)
        })
    }
    // const removedUser = data.users.filter(user => user.email !== userObj.email)
    // const formattedConversation = {
    //     ...data,
    //     users: removedUser
    // }
    return formatConversation(data,userObj)
}

export const matchConversations = (conversations, searchTerm="") => {
    const filteredConversations = conversations.filter(conversation => (conversation.users.some(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))))
    return filteredConversations
}