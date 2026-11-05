import fs from 'fs/promises'
import path from 'path'

const UPLOADS_DIR = path.join(import.meta.dirname, '..', 'public', 'uploads')

export async function saveImageMiddleware(req, res, next) {
  try {
    const { disegno } = req.body

    if (!disegno) {
      return res.status(400).json({ message: 'Disegno mancante' })
    }

    const filename = `sketch_${req.session.utenteId}_${Date.now()}.png`
    const buffer = Buffer.from(disegno.split(',')[1], 'base64')

    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer)

    req.savedImage = `/uploads/${filename}`

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Errore salvataggio immagine' })
  }
}
