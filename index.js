import express from 'express';
import { db } from './config/db.js'
import colors from 'colors';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
dotenv.config()

const app = express();

db()

app.use(express.json())
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(colors.cyan('Server running in PORT:'), PORT)
})