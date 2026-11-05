export const requireAuth = (req, res, next) => {
  if (!req.session.utenteId) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
  next()
}
