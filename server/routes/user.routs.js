// routes/user.route.js
import express from 'express'
import { register, login, logout, update, getProfile } from '../controllers/user.controller.js'
import isAuthanticated from '../middlewares/isAuthanticated.js'
import {singleUpload} from '../middlewares/multer.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', isAuthanticated, getProfile)          
router.put('/update', isAuthanticated,singleUpload, update)

export default router