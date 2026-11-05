import { Router } from 'express'
import sketchController from '../controllers/sketchController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { saveImageMiddleware } from '../middleware/imageMiddleware.js'

const router = Router()

router.get('/', sketchController.getSketches)
router.post('/', requireAuth, saveImageMiddleware, sketchController.createSketch)
router.get('/:id', sketchController.getSketch)
router.get('/:id/guesses', requireAuth, sketchController.getGuesses)
router.post('/:id/guesses', requireAuth, sketchController.createGuess)

export default router
