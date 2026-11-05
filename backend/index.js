import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import path from 'path'
import { sequelize } from './models/index.js'
import authRoutes from './routes/authRoutes.js'
import sketchRoutes from './routes/sketchRoutes.js'
import wordRoutes from './routes/wordRoutes.js'
import leaderboardRoutes from './routes/leaderboardRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.static('public'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
  },
}))
app.use('/api/auth', authRoutes)
app.use('/api/sketches', sketchRoutes)
app.use('/api/words', wordRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/users', userRoutes)

if (process.env.E2E_TEST === 'true') {
  const { default: testRoutes } = await import('./routes/testRoutes.js')
  app.use('/api/test', testRoutes)
  console.warn('Route di test E2E attive su /api/test')
}

await sequelize.sync()

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
