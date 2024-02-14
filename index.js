import express from 'express';
import { db } from './config/db.js'
import cors from 'cors';
import colors from 'colors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
dotenv.config()

const app = express();

db()

const whiteList = [process.env.FRONTEND_URL, undefined]
const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(colors.cyan('Server running in PORT:'), PORT)
})