import express from "express";
import authMiddleware from '../middleware/authMiddleware.js'
import { multerMiddleware } from '../middleware/multerMiddleware.js'
import { saveAvatar, updateUser, savePicture } from '../controllers/userController.js'

const router = express.Router();

router.patch('/update-user/:usernameUrl', authMiddleware, updateUser)
router.post('/save-picture/:usernameUrl', authMiddleware, saveAvatar)
router.post('/upload-picture/:usernameUrl', authMiddleware, multerMiddleware, savePicture)
export default router