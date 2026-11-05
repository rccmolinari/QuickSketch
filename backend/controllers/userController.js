import { Sketch, Tentativo, Utente } from '../models/index.js'
import { MAX_TENTATIVI } from '../config.js'

class UserController {
  getMyStats = async (req, res) => {
    try {
      const utenteId = req.session.utenteId

      const disegniProdotti = await Sketch.count({ where: { autoreId: utenteId } })
      const tentativi = await Tentativo.findAll({ where: { utenteId } })

      const paroleIndovinate = tentativi.filter(t => t.indovinato).length
      const paroleNonIndovinate = tentativi.filter(t => !t.indovinato && t.parole.length >= MAX_TENTATIVI).length
      const tentativiUtilizzati = tentativi.reduce((tot, t) => tot + t.parole.length, 0)

      res.json({ disegniProdotti, paroleIndovinate, paroleNonIndovinate, tentativiUtilizzati })
    } catch (error) {
      console.error('Error fetching stats:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getMySketches = async (req, res) => {
    try {
      const sketches = await Sketch.findAll({
        where: { autoreId: req.session.utenteId },
        attributes: ['id', 'disegno', 'data'],
        include: { model: Utente, as: 'autore', attributes: ['username'] },
        order: [['data', 'DESC']],
      })
      res.json(sketches)
    } catch (error) {
      console.error('Error fetching user sketches:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new UserController()
