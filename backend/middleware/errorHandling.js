const fieldArrayFunc = (fieldArray) => {
    let fieldSentence;
    if(fieldArray.length === 1){
        fieldSentence = fieldArray[0].charAt(0).toUpperCase() + fieldArray[0].slice(1)
    }else{
        for(let i = 0; i<fieldArray.length; i++){
            fieldArray[i] = fieldArray[i].charAt(0).toUpperCase() + fieldArray[i].slice(1)
        }
        fieldSentence = fieldArray.slice(0,fieldArray.length-1).join(', ') + ", and " + fieldArray.slice(-1)
    }
    return fieldSentence
}

const errorHandling = async(error,req,res,next) => {
    // console.log(typeof(error.message))
    let sentence;
    if(error.name === "MongoError" && error.code === 11000){
        const fieldArray = Object.keys(error.keyValue)
        sentence = fieldArrayFunc(fieldArray) + " already exists."
        // console.log(sentence)
        res.status(500).send({error: sentence})
    }
    else if(error.name === "ValidationError"){
        const fieldArray = Object.keys(error.errors)
        sentence = fieldArrayFunc(fieldArray) + " must be provided."
        // console.log(sentence)
        res.status(500).send({error: sentence})
    }
    else{
        res.status(500).send({error: "There was an error."})
        // next()
    }
}
module.exports = errorHandling