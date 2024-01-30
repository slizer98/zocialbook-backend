import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const authMiddleware = async(req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select('_id username email')
            next()
        } catch {
            const error = new Error('No estas autorizado')
            res.status(401).json({ msg: error.message })
        }
    } else {
        const error = new Error('No estas autorizado')
        res.status(401).json({ msg: error.message })
    }
}

export default authMiddleware