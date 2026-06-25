import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { encodeTableId, decodeTableId } from '../utils/tableHash.js'

const router = Router()

// Helper: attach hash field to each table row
function attachHash(rows) {
  return rows.map(row => ({ ...row, hash: encodeTableId(row.id) }))
}

// 1. Get all tables (admin + cashier)
router.get('/', protect(['admin', 'cashier']), async (req, res) => {
  try {
    const [rows] = await req.db.query('SELECT * FROM tables ORDER BY table_number ASC')
    return res.json(attachHash(rows))
  } catch (error) {
    console.error('Get Tables Error:', error)
    return res.status(500).json({ message: 'Gagal mengambil data meja.' })
  }
})

// 2. Get single table by hash (for customer onboarding via QR)
router.get('/h/:hash', async (req, res) => {
  const { hash } = req.params
  try {
    const id = decodeTableId(hash)
    const [rows] = await req.db.query('SELECT * FROM tables WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Meja tidak ditemukan.' })
    }
    return res.json({ ...rows[0], hash })
  } catch (error) {
    console.error('Get Table By Hash Error:', error)
    return res.status(500).json({ message: 'Gagal memverifikasi meja.' })
  }
})

// 3. Get single table by ID (legacy / internal use)
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await req.db.query('SELECT * FROM tables WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Meja tidak ditemukan.' })
    }
    return res.json({ ...rows[0], hash: encodeTableId(rows[0].id) })
  } catch (error) {
    console.error('Get Single Table Error:', error)
    return res.status(500).json({ message: 'Gagal memverifikasi meja.' })
  }
})

// 4. Admin: Add table
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

    const [result] = await req.db.query(
      'INSERT INTO tables (table_number, capacity, status) VALUES (?, ?, ?)',
      [table_number, capacity || 4, 'available']
    )

    const newHash = encodeTableId(result.insertId)
    return res.status(201).json({ message: 'Meja berhasil dibuat.', id: result.insertId, hash: newHash })
  } catch (error) {
    console.error('Create Table Error:', error)
    return res.status(500).json({ message: 'Gagal menambahkan meja.' })
  }
})

export default router

