import express from "express";
import { register, verifyAccount, login, user, changePassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyAccount)
router.post('/login', login)

// private route
router.get('/user', authMiddleware, user)
router.patch('/change-password', authMiddleware, changePassword)

export default router