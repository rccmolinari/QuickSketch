import { Sketch, Tentativo, Utente } from '../models/index.js'
import { MAX_TENTATIVI } from '../config.js'

class SketchController {
  statoTentativo(tentativo, sketch) {
    const parole = tentativo ? tentativo.parole : []
    const indovinato = tentativo ? tentativo.indovinato : false
    const finito = indovinato || parole.length >= MAX_TENTATIVI
    return {
      parole,
      indovinato,
      rimasti: Math.max(0, MAX_TENTATIVI - parole.length),
      finito,
      parola: finito ? sketch.parola : undefined,
    }
  }

  getSketches = async (req, res) => {
    try {
      const sketches = await Sketch.findAll({
        attributes: ['id', 'disegno', 'data'],
        include: { model: Utente, as: 'autore', attributes: ['username'] },
        order: [['data', 'DESC']],
      })
      res.json(sketches)
    } catch (error) {
      console.error('Error fetching sketches:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getSketch = async (req, res) => {
    try {
      const sketch = await Sketch.findByPk(req.params.id, {
        include: { model: Utente, as: 'autore', attributes: ['username'] },
      })

      if (!sketch) {
        return res.status(404).json({ message: 'Sketch not found' })
      }

      const isAutore = req.session.utenteId === sketch.autoreId

      res.json({
        id: sketch.id,
        disegno: sketch.disegno,
        data: sketch.data,
        autore: sketch.autore,
        parola: isAutore ? sketch.parola : undefined,
      })
    } catch (error) {
      console.error('Error fetching sketch:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  createSketch = async (req, res) => {
    const { parola } = req.body

    if (!parola) {
      return res.status(400).json({ message: 'Parola required' })
    }

    try {
      const sketch = await Sketch.create({
        parola: parola.trim(),
        disegno: req.savedImage,
        autoreId: req.session.utenteId,
      })
      res.status(201).json({ id: sketch.id, data: sketch.data })
    } catch (error) {
      console.error('Error creating sketch:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  getGuesses = async (req, res) => {
    try {
      const sketch = await Sketch.findByPk(req.params.id)
      if (!sketch) {
        return res.status(404).json({ message: 'Sketch not found' })
      }

      const tentativo = await Tentativo.findOne({
        where: { utenteId: req.session.utenteId, sketchId: sketch.id },
      })

      res.json(this.statoTentativo(tentativo, sketch))
    } catch (error) {
      console.error('Error fetching guesses:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  createGuess = async (req, res) => {
    const { parola } = req.body
    const utenteId = req.session.utenteId

    if (!parola || !parola.trim()) {
      return res.status(400).json({ message: 'Word is required' })
    }

    try {
      const sketch = await Sketch.findByPk(req.params.id)
      if (!sketch) {
        return res.status(404).json({ message: 'Sketch not found' })
      }

      if (sketch.autoreId === utenteId) {
        return res.status(403).json({ message: 'You cannot guess your own sketch' })
      }

      const [tentativo] = await Tentativo.findOrCreate({
        where: { utenteId, sketchId: sketch.id },
        defaults: { parole: [] },
      })

      if (tentativo.indovinato || tentativo.parole.length >= MAX_TENTATIVI) {
        return res.status(403).json({ message: 'Game over for this sketch', ...this.statoTentativo(tentativo, sketch) })
      }

      const guess = parola.trim().toLowerCase()
      tentativo.parole = [...tentativo.parole, guess]
      tentativo.indovinato = guess === sketch.parola.toLowerCase()
      await tentativo.save()

      res.json(this.statoTentativo(tentativo, sketch))
    } catch (error) {
      console.error('Error creating guess:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default new SketchController()
