import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { updateUser } from '../controllers/userController.js'

const router = express.Router();

router.patch('/update-user/:usernameUrl', authMiddleware, updateUser)

export default router