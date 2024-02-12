import { json } from 'express'
import { sendEmailVerification } from '../emails/authEmailService.js'
import User from '../models/User.js'
import { errorMessages, generateJWT } from '../utils/index.js'
import bcrypt from 'bcrypt'

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

const updateUser = async (req, res) => {
    const { user } = req
    const { username, email, favoriteAuthor, location, birthday} = req.body
}

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const { user } = req
    
    if( Object.values(req.body).includes('') ) {
        return errorMessages(res, 'Todos los campos son obligatorios', 400);
    }
    if (oldPassword === newPassword) {
        return errorMessages(res, 'La nueva contraseña debe ser diferente a la actual', 400);
    }
    
    if (!user) {
        return errorMessages(res, 'Usuario no encontrado', 404);
    }
    try {
        const userFromDB = await User.findById(user._id);

        if (!userFromDB) {
            return errorMessages(res, 'Usuario no encontrado', 404);
        }
        
        const isPasswordCorrect = await bcrypt.compare(oldPassword, userFromDB.password)

        if (!isPasswordCorrect) {
            return errorMessages(res, 'La contraseña actual es incorrecta', 400);
        }
        // Check if the new password is the same as the old ones
        const newPasswordCopy = newPassword;
        let isOldPasswordUsed = false;
        for (const oldPassword of userFromDB.oldPasswords) {
            if (await bcrypt.compare(newPasswordCopy, oldPassword)) {
                isOldPasswordUsed = true;
                break;
            }
        }

        if (isOldPasswordUsed) {
            return errorMessages(res, 'No puedes usar contraseñas anteriores', 400);
        }

        userFromDB.oldPasswords.push(userFromDB.password);
        userFromDB.password = newPassword;
        const token = generateJWT(userFromDB._id); 
        await userFromDB.save();
        return res.json({ token });
    } catch (error) {
        return errorMessages(res, 'Ocurrió un error al cambiar la contraseña', 500);
    }
}
    

const user = async (req, res) => {
    const { user } = req
    try {
        res.status(200).json(user)
    } catch (error) {
        return errorMessages(res, 'Ocurrió un error en usernameUrl', 500)
    }
}

export {
    register,
    verifyAccount,
    login, 
    updateUser,
    updatePassword,
    user
}