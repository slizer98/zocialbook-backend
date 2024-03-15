import { sendEmailVerification } from '../emails/authEmailService.js'
import User from '../models/User.js'
import { errorMessages } from '../utils/index.js'
import { v2 as cloudinary } from 'cloudinary'

const updateUser = async (req, res) => {
    const { user } = req
    const { username, favoriteAuthor, location, birthday, aboutMe, annualBookGoal} = req.body
    const requiredFields = [username, birthday]

    if(!user) {
        return errorMessages(res, 'Usuario no encontrado', 404)
    }

    if( user.usernameUrl !== req.params.usernameUrl) {
        return errorMessages(res, 'No tienes permisos para realizar esta acción', 401)
    }

    if(requiredFields.includes('')) {
        return errorMessages(res, 'Todos los campos son obligatorios', 400)
    }

    try {
        const userFromDB = await User.findById(user._id)
        if(!userFromDB) {
            return errorMessages(res, 'Usuario no encontrado', 404)
        }
        userFromDB.username = username
        userFromDB.favoriteAuthor = favoriteAuthor
        userFromDB.location = location
        userFromDB.birthday = birthday
        userFromDB.aboutMe = aboutMe
        userFromDB.annualBookGoal = annualBookGoal
        await userFromDB.save()
        res.status(200).json({ msg: 'Usuario actualizado correctamente' })
    } catch (error) {
        console.log(error)
        return errorMessages(res, 'Ocurrió un error al actualizar el usuario', 500)
    }
}

const saveAvatar = async (req, res) => {
    const { user } = req
    const { profilePicture } = req.body
    if(!profilePicture) {
        return errorMessages(res, 'No se ha enviado una imagen', 400)
    }
    if(!user) {
        return errorMessages(res, 'Usuario no encontrado', 404)
    }

    if( user.usernameUrl !== req.params.usernameUrl) {
        return errorMessages(res, 'No tienes permisos para realizar esta acción', 401)
    }

    try {

        const userFromDB = await User.findById(user._id)
        if(!userFromDB) {
            return errorMessages(res, 'Usuario no encontrado', 404)
        }
        
        userFromDB.profilePicture = profilePicture
        await userFromDB.save()
        res.status(200).json({ msg: 'Foto de perfil actualizada correctamente' })
    } catch (error) {
        console.log(error)
        return errorMessages(res, `Ocurrió un error al actualizar la foto de perfil: ${error}`, 500)
    }
}

const savePictureCloudinary = async (fileSelected) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })

    const uploadPreset = 'zocialbook'
    const result = await cloudinary.uploader.upload(fileSelected, {
        upload_preset: uploadPreset
    })
    return result.secure_url

    
}

export {
    updateUser,
    saveAvatar,
}