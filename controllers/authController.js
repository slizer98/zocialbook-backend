import User from '../models/User.js'

const register = async (req, res) => {
    if(Object.values(req.body).includes('')) {
        const error = new Error('Todos los campos son obligatorios')
        return res.status(400).json({ msg: error.message })
    }
    try {
        const user = new User(req.body)
        await user.save()
        res.status(201).json({ msg: 'Usuario creado correctamente' })
    } catch (error) {
        console.log(error)
    }
}

export {
    register
}