import { Router } from 'express'
import MessageController from '../controllers/messageController.js'

const router = new Router()

router.post('/sendMessage', MessageController.handle)

export default router