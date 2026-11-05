import { Router } from 'express'
import wordController from '../controllers/wordController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/random', requireAuth, wordController.getRandomWords)

export default router
