import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { saveAvatar, updateUser } from '../controllers/userController.js'

const router = express.Router();

router.patch('/update-user/:usernameUrl', authMiddleware, updateUser)
router.post('/save-picture/:usernameUrl', authMiddleware, saveAvatar)

export default router