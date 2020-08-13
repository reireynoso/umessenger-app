import moment from 'moment'

export const organizeMessages = (messages) => {
    const messageOrganized = {}
    let previousDate;
    for(let i = 0; i < messages.length; i++){
        if(!previousDate){
            previousDate = moment(messages[i].createdAt).format('L')
            messageOrganized[previousDate] = [{...messages[i], nextMessageUser: messages[i+1] ? messages[i+1].user : null}]
        }else if(!moment(previousDate).isSame(messages[i].createdAt, 'day')){
            previousDate = moment(messages[i].createdAt).format('L')
            messageOrganized[previousDate] = [{...messages[i], nextMessageUser: messages[i+1] ? messages[i+1].user : null}]
        }
        else if(messageOrganized[moment(messages[i].createdAt).format('L')]){
            messageOrganized[moment(messages[i].createdAt).format('L')] = [...messageOrganized[moment(messages[i].createdAt).format('L')], {...messages[i], nextMessageUser: messages[i+1] ? messages[i+1].user : null}]
        }
    }
    return messageOrganized
}