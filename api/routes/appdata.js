import { Router } from 'express';
import { appdataController } from '../controllers/index.js'

const router = Router()

router.post('/', appdataController.appdatacontroller)

export default router;