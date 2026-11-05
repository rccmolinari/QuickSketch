import bcrypt from 'bcryptjs'
import { Utente } from '../models/index.js'

class AuthController {
  register = async (req, res) => {
    const { username, email, password } = req.body

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, username, and password are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    try {
      const existing = await Utente.findOne({ where: { email } })
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' })
      }

      const hash = await bcrypt.hash(password, 10)
      const user = await Utente.create({ username, email, password: hash })

      req.session.utenteId = user.id
      res.status(201).json({ message: 'User registered successfully', userId: user.id })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Username already in use' })
      }
      console.error('Error registering user:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
      const user = await Utente.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      const passwordOk = await bcrypt.compare(password, user.password)
      if (!passwordOk) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }

      req.session.utenteId = user.id
      res.status(200).json({ message: 'Login successful' })
    } catch (error) {
      console.error('Error logging in:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  logout = (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.status(200).json({ message: 'Logout successful' })
    })
  }

  me = async (req, res) => {
    const user = await Utente.findByPk(req.session.utenteId, {
      attributes: ['id', 'username', 'email'],
    })

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    res.status(200).json(user)
  }
}

export default new AuthController()
