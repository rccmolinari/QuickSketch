import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import { Utente, Sketch } from '../models/index.js'

const UPLOADS_DIR = path.join(import.meta.dirname, '..', 'public', 'uploads')

const router = Router()

router.delete('/users/:username', async (req, res) => {
  const { username } = req.params

  if (!username.startsWith('e2e_')) {
    return res.status(403).json({ message: 'Solo utenti di test (prefisso e2e_)' })
  }

  try {
    const user = await Utente.findOne({ where: { username } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const sketches = await Sketch.findAll({
      where: { autoreId: user.id },
      attributes: ['disegno'],
    })

    await user.destroy()

    for (const s of sketches) {
      await fs.rm(path.join(UPLOADS_DIR, path.basename(s.disegno)), { force: true })
    }

    res.status(200).json({ deleted: 1, immaginiRimosse: sketches.length })
  } catch (error) {
    console.error('Error deleting test user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
