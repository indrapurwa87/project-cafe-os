import { Router } from 'express'
import pool from '../config/db.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

// 1. Get all categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories')
    return res.json(rows)
  } catch (error) {
    console.error('Get Categories Error:', error)
    return res.status(500).json({ message: 'Gagal mengambil kategori.' })
  }
})

// 2. Get all menu items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu_items')
    const formatted = rows.map((item) => ({
      ...item,
      is_available: !!item.is_available,
      is_featured: !!item.is_featured,
    }))
    return res.json(formatted)
  } catch (error) {
    console.error('Get Menu Error:', error)
    return res.status(500).json({ message: 'Gagal mengambil menu.' })
  }
})

// 3. Admin: Add menu item
router.post('/', protect(['admin']), async (req, res) => {
  const { name, category_id, price, description, image_url, is_available, is_featured } = req.body

  if (!name || !category_id || !price) {
    return res.status(400).json({ message: 'Nama, kategori, dan harga wajib diisi.' })
  }

  const id = `item-${Date.now()}`

  try {
    await pool.query(
      'INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        category_id,
        name,
        description || '',
        price,
        image_url || null,
        is_available !== undefined ? is_available : true,
        is_featured !== undefined ? is_featured : false
      ]
    )
    return res.status(201).json({ message: 'Menu berhasil ditambahkan.', id })
  } catch (error) {
    console.error('Create Menu Error:', error)
    return res.status(500).json({ message: 'Gagal menambahkan menu.' })
  }
})

// 4. Admin: Update menu item
router.put('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params
  const { name, category_id, price, description, image_url, is_available, is_featured } = req.body

  try {
    await pool.query(
      'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_available = ?, is_featured = ? WHERE id = ?',
      [
        category_id,
        name,
        description,
        price,
        image_url,
        is_available ? 1 : 0,
        is_featured ? 1 : 0,
        id
      ]
    )
    return res.json({ message: 'Menu berhasil diperbarui.' })
  } catch (error) {
    console.error('Update Menu Error:', error)
    return res.status(500).json({ message: 'Gagal memperbarui menu.' })
  }
})

// 5. Admin: Toggle availability
router.patch('/:id/availability', protect(['admin']), async (req, res) => {
  const { id } = req.params
  const { is_available } = req.body

  try {
    await pool.query('UPDATE menu_items SET is_available = ? WHERE id = ?', [is_available ? 1 : 0, id])
    return res.json({ message: 'Status ketersediaan berhasil diperbarui.' })
  } catch (error) {
    console.error('Toggle Availability Error:', error)
    return res.status(500).json({ message: 'Gagal mengubah ketersediaan menu.' })
  }
})

// 6. Admin: Delete menu item
router.delete('/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params

  try {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id])
    return res.json({ message: 'Menu berhasil dihapus.' })
  } catch (error) {
    console.error('Delete Menu Error:', error)
    return res.status(500).json({ message: 'Gagal menghapus menu.' })
  }
})

// 7. Admin: Add category
router.post('/categories', protect(['admin']), async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi.' })

  const id = `cat-${Date.now()}`
  try {
    await pool.query('INSERT INTO categories (id, name, description) VALUES (?, ?, ?)', [id, name, description || null])
    return res.status(201).json({ message: 'Kategori berhasil ditambahkan.', id })
  } catch (error) {
    console.error('Create Category Error:', error)
    return res.status(500).json({ message: 'Gagal menambahkan kategori.' })
  }
})

// 8. Admin: Update category
router.put('/categories/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  try {
    await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description || null, id])
    return res.json({ message: 'Kategori berhasil diperbarui.' })
  } catch (error) {
    console.error('Update Category Error:', error)
    return res.status(500).json({ message: 'Gagal memperbarui kategori.' })
  }
})

// 9. Admin: Delete category
router.delete('/categories/:id', protect(['admin']), async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [id])
    return res.json({ message: 'Kategori berhasil dihapus.' })
  } catch (error) {
    console.error('Delete Category Error:', error)
    return res.status(500).json({ message: 'Gagal menghapus kategori.' })
  }
})

export default router

