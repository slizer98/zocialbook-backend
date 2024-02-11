import express from "express";
import { register, getUsernameUrl, verifyAccount, login, user, updatePassword, updateUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyAccount)
router.post('/login', login)

// private route
router.get('/user', authMiddleware, user)
router.get('/get-usernameurl', authMiddleware, getUsernameUrl)
router.patch('/update-user', authMiddleware, updateUser)
router.patch('/change-password', authMiddleware, updatePassword)


export default router