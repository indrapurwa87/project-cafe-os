import { masterPool, getTenantPool } from '../config/db.js'

export async function tenantMiddleware(req, res, next) {
  // Jika rute mengarah ke super-admin, lewati pengecekan tenant
  if (req.path.startsWith('/super') || req.path.startsWith('/auth/login/super')) {
    return next()
  }

  const tenantSlug = req.headers['x-tenant-slug']
  if (!tenantSlug) {
    return res.status(400).json({ message: 'Identitas tenant (X-Tenant-Slug) tidak ditemukan pada request.' })
  }

  try {
    // 1. Cari data tenant di database master
    const [rows] = await masterPool.query(
      'SELECT db_name, status, expires_at FROM tenants WHERE slug = ?',
      [tenantSlug]
    )

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client cafe tidak terdaftar.' })
    }

    const tenant = rows[0]

    // 2. Cek status keaktifan tenant
    if (tenant.status !== 'active') {
      return res.status(403).json({ message: `Akses ditolak: Client cafe saat ini berstatus ${tenant.status}.` })
    }

    // 3. Cek masa berlaku langganan
    if (tenant.expires_at && new Date(tenant.expires_at) < new Date()) {
      return res.status(403).json({ message: 'Akses ditolak: Masa berlaku langganan client cafe ini telah berakhir.' })
    }

    // 4. Pasang connection pool dinamis milik tenant ke objek request
    req.db = getTenantPool(tenant.db_name)
    req.tenantSlug = tenantSlug
    next()
  } catch (err) {
    console.error('Tenant Middleware Error:', err)
    return res.status(500).json({ message: 'Terjadi kesalahan saat menghubungkan ke database client.' })
  }
}
