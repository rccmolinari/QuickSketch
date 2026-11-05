import { Router } from 'express'
import leaderboardController from '../controllers/leaderboardController.js'

const router = Router()

router.get('/drawers', leaderboardController.getTopDrawers)
router.get('/players', leaderboardController.getTopPlayers)

export default router
