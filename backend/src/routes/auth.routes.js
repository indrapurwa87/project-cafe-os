import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../config/db.js'

const router = Router()

// Generate JWT Helper
const generateToken = (id, username, role) => {
  return jwt.sign(
    { id, username, role },
    process.env.JWT_SECRET || 'cafeos_jwt_secret_key_12345',
    { expiresIn: '7d' }
  )
}

// 1. Admin Login (email, password)
router.post('/login/admin', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' })
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND role = ?', [email, 'admin'])
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }

    const token = generateToken(user.id, user.username, user.role)
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Admin Login Error:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
  }
})

// 2. Kitchen Login (pin) — matches against ANY user with role='kitchen'
router.post('/login/kitchen', async (req, res) => {
  const { pin } = req.body

  if (!pin) {
    return res.status(400).json({ message: 'PIN wajib diisi.' })
  }

  try {
    // Get all kitchen users and check PIN against each one
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE role = ?',
      ['kitchen']
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'PIN salah.' })
    }

    // Try matching PIN against all kitchen accounts
    let matchedUser = null
    for (const user of rows) {
      const isMatch = await bcrypt.compare(pin, user.password)
      if (isMatch) {
        matchedUser = user
        break
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: 'PIN salah.' })
    }

    const token = generateToken(matchedUser.id, matchedUser.username, matchedUser.role)
    return res.json({
      token,
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        role: matchedUser.role
      }
    })
  } catch (error) {
    console.error('Kitchen Login Error:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
  }
})

// 3. Cashier Login (username + password) — accepts role 'cashier' or 'admin'
router.post('/login/cashier', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' })
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND role IN ('cashier', 'admin')",
      [username]
    )

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah.' })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah.' })
    }

    const token = generateToken(user.id, user.username, user.role)
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Cashier Login Error:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' })
  }
})

export default router
