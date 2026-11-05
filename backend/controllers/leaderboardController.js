import { QueryTypes } from 'sequelize'
import { sequelize } from '../models/index.js'

class LeaderboardController {
  getTopDrawers = async (req, res) => {
    try {
      const top = await sequelize.query(`
        SELECT u.id, u.username, COUNT(*) AS indovinati
        FROM tentativi t
        JOIN sketch s ON s.id = t.sketchId
        JOIN utenti u ON u.id = s.autoreId
        WHERE t.indovinato = 1
        GROUP BY u.id, u.username
        ORDER BY indovinati DESC
        LIMIT 10
      `, { type: QueryTypes.SELECT })

      res.json(top)
    } catch (error) {
      console.error('Error fetching top drawers:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getTopPlayers = async (req, res) => {
    try {
      const top = await sequelize.query(`
        SELECT u.id, u.username, COUNT(*) AS indovinate
        FROM tentativi t
        JOIN utenti u ON u.id = t.utenteId
        JOIN sketch s ON s.id = t.sketchId AND s.autoreId <> t.utenteId
        WHERE t.indovinato = 1
        GROUP BY u.id, u.username
        ORDER BY indovinate DESC
        LIMIT 10
      `, { type: QueryTypes.SELECT })

      res.json(top)
    } catch (error) {
      console.error('Error fetching top players:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new LeaderboardController()
