import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

// 1. Get all tables (admin)
router.get('/', protect(['admin']), async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM tables ORDER BY table_number ASC')
    return res.json(rows)
  } catch (error) {
    console.error('Get Tables Error:', error)
    return res.status(500).json({ message: 'Gagal mengambil data meja.' })
  }
})

// 2. Get single table by ID (for customer onboarding verification)
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await req.db.query('SELECT * FROM tables WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Meja tidak ditemukan.' })
    }
    return res.json(rows[0])
  } catch (error) {
    console.error('Get Single Table Error:', error)
    return res.status(500).json({ message: 'Gagal memverifikasi meja.' })
  }
})

// 3. Admin: Add table
router.post('/', protect(['admin']), async (req, res) => {
  const { table_number, capacity } = req.body

  if (!table_number) {
    return res.status(400).json({ message: 'Nomor meja wajib diisi.' })
  }

  try {
    const [existing] = await req.db.query('SELECT * FROM tables WHERE table_number = ?', [table_number])
    if (existing.length > 0) {
      return res.status(400).json({ message: `Meja nomor ${table_number} sudah ada.` })
    }

    const qr_code_url = `http://localhost:3000/menu/${table_number}` // mock dynamic url for QR

    const [result] = await req.db.query(
      'INSERT INTO tables (table_number, capacity, qr_code_url, status) VALUES (?, ?, ?, ?)',
      [table_number, capacity || 4, qr_code_url, 'available']
    )
    return res.status(201).json({ message: 'Meja berhasil dibuat.', id: result.insertId })
  } catch (error) {
    console.error('Create Table Error:', error)
    return res.status(500).json({ message: 'Gagal menambahkan meja.' })
  }
})

export default router
