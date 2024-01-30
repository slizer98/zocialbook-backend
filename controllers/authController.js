import { sendEmailVerification } from '../emails/authEmailService.js'
import User from '../models/User.js'
import { errorMessages, generateJWT } from '../utils/index.js'

const register = async (req, res) => {
    if(Object.values(req.body).includes('')) {
        return  errorMessages(res, 'Todos los campos son obligatorios', 400)
    }

    const { username, email, password  } = req.body
    const userExists = await User.findOne({ email })
    if(userExists) {
        return errorMessages(res, 'El usuario ya esta registrado', 400)
    }
    
    const MIN_PASSWORD_LENGTH = 8
    if(password.trim().length < MIN_PASSWORD_LENGTH) {
        return errorMessages(res, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`, 400)
    }
    
    try {
        const user = new User(req.body)
        const result = await user.save()
       
        const { username, email, token } = result
        sendEmailVerification({ username, email, token })
        
        res.status(201).json({ msg: 'Usuario creado correctamente, revisa tu correo' })
    } catch (error) {
        if (error.code === 11000) {
            return errorMessages(res, 'El nombre de usuario debe ser unico', 400)
        }
    }
}

const verifyAccount = async (req, res) => {
    const { token } = req.params
    const user = await User.findOne({ token })
    if(!user) {
        return errorMessages(res, 'Hubo un error, token no válido', 401)
    }
    try {
        user.verified = true
        user.token = ""
        await user.save()
        res.status(200).json({ msg: 'Cuenta verificada correctamente, ya puedes iniciar sesión' })
    } catch (error) {
        return errorMessages(res, 'Hubo un error', 404)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) {
        return errorMessages(res, 'El usuario no existe', 400)
    }   
    if(!user.verified) {
        return errorMessages(res, 'Tu cuenta no ha sido confirmada aún', 400)
    }
    if(await user.checkPassword(password)) {

        const token = generateJWT(user._id)
        res.status(200).json({ token })

    } else {
        return errorMessages(res, 'La contraseña es incorrecta', 400)
    }

}

const user = async (req, res) => {
    console.log(req.user)
}

export {
    register,
    verifyAccount,
    login, 
    user
}