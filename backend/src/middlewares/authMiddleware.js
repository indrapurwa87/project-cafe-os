import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const protect = (roles = []) => {
  return (req, res, next) => {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cafeos_jwt_secret')

        req.user = decoded

        // Role check — super-admin bypasses all role restrictions
        if (roles.length > 0 && decoded.role !== 'super-admin' && !roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Akses ditolak: Peran tidak sah.' })
        }

        return next()
      } catch (error) {
        console.error('JWT Verification Error:', error.message)
        return res.status(401).json({ message: 'Sesi tidak sah, token kedaluwarsa atau salah.' })
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Akses ditolak: Token tidak ditemukan.' })
    }
  }
}
