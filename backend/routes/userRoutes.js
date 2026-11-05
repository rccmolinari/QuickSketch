import { Router } from 'express'
import userController from '../controllers/userController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/me/stats', requireAuth, userController.getMyStats)
router.get('/me/sketches', requireAuth, userController.getMySketches)

export default router
