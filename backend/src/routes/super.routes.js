import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { masterPool, getTenantPool } from '../config/db.js'

const router = Router()

// Helper to generate JWT for Super Admin
const generateSuperToken = (username) => {
  return jwt.sign(
    { id: 'super', username, role: 'super-admin' },
    process.env.JWT_SECRET || 'cafeos_jwt_secret_key_12345',
    { expiresIn: '7d' }
  )
}

// Auth middleware for Super Admin endpoints
const protectSuper = (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cafeos_jwt_secret_key_12345')
      if (decoded.role !== 'super-admin') {
        return res.status(403).json({ message: 'Akses ditolak: Bukan Super Admin.' })
      }
      req.superUser = decoded
      return next()
    } catch (error) {
      return res.status(401).json({ message: 'Sesi tidak sah, token kadaluwarsa.' })
    }
  }
  return res.status(401).json({ message: 'Akses ditolak: Token tidak ditemukan.' })
}

// 1. Super Admin Login
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body
  const expectedUser = process.env.SUPER_ADMIN_USER || 'admin'
  const expectedPass = process.env.SUPER_ADMIN_PASS || 'supersecret'

  if (username === expectedUser && password === expectedPass) {
    const token = generateSuperToken(username)
    return res.json({
      token,
      user: { username, role: 'super-admin' }
    })
  } else {
    return res.status(401).json({ message: 'Kredensial Super Admin salah.' })
  }
})

// 2. Get All Tenants
router.get('/tenants', protectSuper, async (req, res) => {
  try {
    const [rows] = await masterPool.query('SELECT * FROM tenants ORDER BY created_at DESC')
    return res.json(rows)
  } catch (err) {
    console.error('Super Admin Get Tenants Error:', err)
    return res.status(500).json({ message: 'Gagal mengambil data client.' })
  }
})

// 3. Create Tenant (SaaS Provisioning)
router.post('/tenants', protectSuper, async (req, res) => {
  const { name, slug, owner_name, owner_email, plan } = req.body

  if (!name || !slug || !owner_name || !owner_email || !plan) {
    return res.status(400).json({ message: 'Data pendaftaran client tidak lengkap.' })
  }

  // Sanitasi slug dan rancang nama database
  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
  const dbName = `cafeos_${sanitizedSlug.replace(/-/g, '_')}`

  try {
    // 1. Periksa duplikasi slug di master database
    const [existing] = await masterPool.query('SELECT id FROM tenants WHERE slug = ?', [sanitizedSlug])
    if (existing.length > 0) {
      return res.status(400).json({ message: `URL Slug "${sanitizedSlug}" sudah digunakan oleh client lain.` })
    }

    // 2. Hitung waktu kadaluwarsa langganan
    const expiresAt = new Date()
    if (plan === 'yearly') {
      expiresAt.setDate(expiresAt.getDate() + 365)
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30) // default monthly
    }

    // 3. Buat database tenant baru di MySQL server
    await masterPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)

    // 4. Inisialisasi tabel skema penyewa di database baru tersebut
    const tenantSchemaPath = path.join(process.cwd(), 'tenant_schema.sql')
    const tenantSchemaSql = fs.readFileSync(tenantSchemaPath, 'utf8')
    // Pisahkan instruksi SQL berdasarkan ';'
    const queries = tenantSchemaSql.split(';').map(q => q.trim()).filter(q => q.length > 0)

    const tenantPool = getTenantPool(dbName)
    const conn = await tenantPool.getConnection()
    
    try {
      for (const query of queries) {
        await conn.query(query)
      }

      // 5. Seed default Admin User untuk tenant baru tersebut agar pemilik cafe bisa login
      const defaultPassword = 'admin123'
      const hashed = await bcrypt.hash(defaultPassword, 10)
      
      // Cek apakah user admin sudah ada (just in case)
      const [userRows] = await conn.query('SELECT id FROM users WHERE username = ?', [owner_email])
      if (userRows.length === 0) {
        await conn.query(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [owner_email, hashed, 'admin']
        )
      }
    } finally {
      conn.release()
    }

    // 6. Simpan detail tenant ke tabel `tenants` database master
    await masterPool.query(
      `INSERT INTO tenants (name, slug, db_name, owner_name, owner_email, plan, expires_at, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sanitizedSlug, dbName, owner_name, owner_email, plan, expiresAt, 'active']
    )

    return res.status(201).json({
      success: true,
      message: `Tenant "${name}" berhasil dibuat dengan database "${dbName}".`,
      defaultCredentials: {
        username: owner_email,
        password: 'admin123'
      }
    })

  } catch (err) {
    console.error('Super Admin Create Tenant Error:', err)
    return res.status(500).json({ message: 'Terjadi kesalahan sistem saat membuat client baru.' })
  }
})

// 4. Update Tenant Status (Suspend / Activate)
router.patch('/tenants/:id/status', protectSuper, async (req, res) => {
  const { id } = req.params
  const { status } = req.body // 'active' or 'suspended'

  if (!status || !['active', 'suspended'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' })
  }

  try {
    await masterPool.query('UPDATE tenants SET status = ? WHERE id = ?', [status, id])
    return res.json({ success: true, message: `Status client berhasil diubah menjadi ${status}.` })
  } catch (err) {
    console.error('Super Admin Change Status Error:', err)
    return res.status(500).json({ message: 'Gagal merubah status client.' })
  }
})

// 5. Extend Subscription
router.patch('/tenants/:id/extend', protectSuper, async (req, res) => {
  const { id } = req.params
  const { plan } = req.body // 'monthly' or 'yearly'

  if (!plan || !['monthly', 'yearly'].includes(plan)) {
    return res.status(400).json({ message: 'Paket perpanjangan tidak valid.' })
  }

  try {
    const [rows] = await masterPool.query('SELECT expires_at FROM tenants WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client tidak ditemukan.' })
    }

    let currentExpiry = new Date(rows[0].expires_at)
    // Jika paket sudah kedaluwarsa, hitung mulai hari ini
    if (currentExpiry < new Date()) {
      currentExpiry = new Date()
    }

    const daysToAdd = plan === 'yearly' ? 365 : 30
    currentExpiry.setDate(currentExpiry.getDate() + daysToAdd)

    await masterPool.query('UPDATE tenants SET expires_at = ?, plan = ?, status = ? WHERE id = ?', [
      currentExpiry,
      plan,
      'active',
      id
    ])

    return res.json({
      success: true,
      message: `Langganan berhasil diperpanjang hingga ${currentExpiry.toLocaleDateString('id-ID')}.`
    })
  } catch (err) {
    console.error('Super Admin Extend Subscription Error:', err)
    return res.status(500).json({ message: 'Gagal memperpanjang langganan client.' })
  }
})

export default router
