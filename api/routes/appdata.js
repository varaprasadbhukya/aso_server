import { Router } from 'express';
import { appdataController } from '../controllers/index.js'
import { verifyToken } from '../middlewares/index.js'

const router = Router()
router.post('/', verifyToken, appdataController.appdatacontroller)
router.post('/reply', verifyToken, appdataController.replycontroller)


export default router;