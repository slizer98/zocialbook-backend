
function validateObjectId(id, res) {
    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('El ID no es válido')
        return res.status(400).json({ msg: error.message})
    }
}

function handleNotFoundError(message, res) {
    const error = new Error(message)
    res.status(404).json({ msg: error.message })
}

function errorMessages(res, msgError, code) {
    const error = new Error(msgError)
    res.status(code).json({ msg: error.message })
}

const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

export {
    validateObjectId,
    handleNotFoundError,
    errorMessages,
    uniqueId
}