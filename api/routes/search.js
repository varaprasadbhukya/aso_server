import { Router } from 'express';
import { searchController } from '../controllers/index.js'

const router = Router()

router.post('/', searchController.searchcontroller)

export default router;