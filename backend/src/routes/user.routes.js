import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

// 1. Get all users (admin only — exclude passwords)
router.get('/', protect(['admin']), async (req, res) => {
  try {
    const [rows] = await req.db.query(
      'SELECT id, username, role, created_at FROM users ORDER BY created_at ASC'
    )
    return res.json(rows)
  } catch (error) {
    console.error('Get Users Error:', error)
    return res.status(500).json({ message: 'Gagal mengambil data user.' })
  }
})

// 2. Create new user (admin only)
router.post('/', protect(['admin']), async (req, res) => {
  const { username, password, role } = req.body

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password/PIN, dan role wajib diisi.' })
  }

  if (!['admin', 'kitchen', 'cashier'].includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid. Harus admin, kitchen, atau cashier.' })
  }

  try {
    // Check for duplicate username
    const [existing] = await req.db.query('SELECT id FROM users WHERE username = ?', [username])
    if (existing.length > 0) {
      return res.status(400).json({ message: `Username "${username}" sudah digunakan.` })
    }

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await req.db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashed, role]
    )

    return res.status(201).json({
      message: 'User berhasil dibuat.',
      user: { id: result.insertId, username, role }
    })
  } catch (error) {
    console.error('Create User Error:', error)
    return res.status(500).json({ message: 'Gagal membuat user.' })
  }
})

// 3. Update user password/PIN (admin only)
router.patch('/:id/password', protect(['admin']), async (req, res) => {
  const { id } = req.params
  const { password } = req.body

  if (!password || password.length < 4) {
    return res.status(400).json({ message: 'Password/PIN minimal 4 karakter.' })
  }

  try {
    const hashed = await bcrypt.hash(password, 10)
    await req.db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, id])
    return res.json({ message: 'Password berhasil diubah.' })
  } catch (error) {
    console.error('Update Password Error:', error)
    return res.status(500).json({ message: 'Gagal mengubah password.' })
  }
})

// 4. Delete user (admin only — cannot delete own account)
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params
  const requestingUserId = req.user.id

  if (String(id) === String(requestingUserId)) {
    return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri.' })
  }

  try {
    const [rows] = await req.db.query('SELECT id FROM users WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' })
    }

    await req.db.query('DELETE FROM users WHERE id = ?', [id])
    return res.json({ message: 'User berhasil dihapus.' })
  } catch (error) {
    console.error('Delete User Error:', error)
    return res.status(500).json({ message: 'Gagal menghapus user.' })
  }
})

export default router
