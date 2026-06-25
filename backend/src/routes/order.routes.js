import { Router } from 'express'
import { protect } from '../middlewares/authMiddleware.js'

export default function(io) {
  const router = Router()

  // 1. Create order (Customer)
  router.post('/', async (req, res) => {
    const {
      table_id,
      customer_name,
      customer_phone,
      items,
      kitchen_note,
      total_amount,
      payment_method
    } = req.body

    if (!table_id || !customer_name || !customer_phone || !items || items.length === 0 || !total_amount) {
      return res.status(400).json({ message: 'Data pesanan tidak lengkap.' })
    }

    const orderId = `ord-${Date.now()}`
    const connection = await req.db.getConnection()

    try {
      await connection.beginTransaction()

      // Insert order
      await connection.query(
        `INSERT INTO orders (id, table_id, customer_name, customer_phone, status, total_amount, payment_status, payment_method, kitchen_note) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          table_id,
          customer_name,
          customer_phone,
          'pending',
          total_amount,
          'paid',          // langsung lunas — tidak ada payment gateway
          payment_method,
          kitchen_note || ''
        ]
      )

      // Insert order items
      for (const item of items) {
        const subtotal = item.price * item.qty
        await connection.query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, notes, price, subtotal) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.menuItemId,
            item.qty,
            item.notes || '',
            item.price,
            subtotal
          ]
        )
      }

      await connection.commit()

      // Fetch the created order with table details for Socket.io broadcast
      const [tableRows] = await connection.query('SELECT table_number FROM tables WHERE id = ?', [table_id])
      const tableNumber = tableRows[0]?.table_number || table_id

      const newOrderEventData = {
        id: orderId,
        tableNumber,
        customerName: customer_name,
        customerPhone: customer_phone,
        itemCount: items.reduce((sum, i) => sum + i.qty, 0),
        totalAmount: total_amount,
        status: 'pending',
        paymentMethod: payment_method,
        paymentStatus: 'unpaid',
        kitchenNote: kitchen_note || '',
        created_at: new Date().toISOString(),
        items: items.map(i => ({
          name: i.name,
          qty: i.qty,
          notes: i.notes || ''
        }))
      }

      // Broadcast to KDS
      io.emit('order:new', newOrderEventData)

      return res.status(201).json({
        success: true,
        message: 'Pesanan berhasil dibuat.',
        orderId
      })
    } catch (error) {
      await connection.rollback()
      console.error('Create Order Transaction Error:', error)
      return res.status(500).json({ message: 'Gagal membuat pesanan.' })
    } finally {
      connection.release()
    }
  })

  // 2. Get orders (Admin/KDS)
  router.get('/', async (req, res) => {
    try {
      // Query orders with table numbers
      const [orders] = await req.db.query(
        `SELECT o.*, t.table_number 
         FROM orders o 
         JOIN tables t ON o.table_id = t.id 
         ORDER BY o.created_at DESC`
      )

      // Retrieve items for each order
      const ordersWithItems = []
      for (const order of orders) {
        const [items] = await req.db.query(
          `SELECT oi.quantity as qty, oi.notes, oi.price, oi.subtotal, m.name 
           FROM order_items oi 
           JOIN menu_items m ON oi.menu_item_id = m.id 
           WHERE oi.order_id = ?`,
          [order.id]
        )

        ordersWithItems.push({
          id: order.id,
          tableNumber: order.table_number,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          itemCount: items.reduce((sum, i) => sum + i.qty, 0),
          totalAmount: order.total_amount,
          status: order.status,
          paymentStatus: order.payment_status,
          paymentMethod: order.payment_method,
          kitchenNote: order.kitchen_note,
          created_at: order.created_at,
          items: items.map(i => ({
            name: i.name,
            qty: i.qty,
            notes: i.notes
          }))
        })
      }

      return res.json(ordersWithItems)
    } catch (error) {
      console.error('Get Orders Error:', error)
      return res.status(500).json({ message: 'Gagal mengambil pesanan.' })
    }
  })

  // 3. Update order status (KDS/Admin)
  router.patch('/:id/status', async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: 'Status wajib dikirim.' })
    }

    try {
      await req.db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id])

      // Broadcast changes
      io.emit('order:status_changed', { orderId: id, status })

      return res.json({ success: true, message: 'Status pesanan berhasil diperbarui.' })
    } catch (error) {
      console.error('Update Status Error:', error)
      return res.status(500).json({ message: 'Gagal memperbarui status.' })
    }
  })

  // 4. Update payment status to paid (Admin Cashier)
  router.patch('/:id/pay', async (req, res) => {
    const { id } = req.params

    try {
      await req.db.query("UPDATE orders SET payment_status = 'paid' WHERE id = ?", [id])
      io.emit('order:status_changed', { orderId: id, paymentStatus: 'paid' })
      return res.json({ success: true, message: 'Pembayaran dikonfirmasi.' })
    } catch (error) {
      console.error('Update Payment Error:', error)
      return res.status(500).json({ message: 'Gagal mengonfirmasi pembayaran.' })
    }
  })

  // 5. Get statistics for Admin Dashboard
  router.get('/stats', async (req, res) => {
    try {
      // 1. Total revenue today
      const [revRows] = await req.db.query(
        "SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid' AND DATE(created_at) = CURDATE()"
      )
      const revenueToday = revRows[0]?.total || 0

      // 2. Orders today
      const [ordRows] = await req.db.query(
        "SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()"
      )
      const ordersToday = ordRows[0]?.count || 0

      // 3. Active tables (occupied table count)
      const [tableRows] = await req.db.query(
        "SELECT COUNT(DISTINCT table_id) as count FROM orders WHERE status IN ('pending', 'processing', 'ready')"
      )
      const activeTables = tableRows[0]?.count || 0

      const [totalTablesRow] = await req.db.query("SELECT COUNT(*) as count FROM tables")
      const totalTables = totalTablesRow[0]?.count || 10

      // 4. Average order value today
      const avgOrderValue = ordersToday > 0 ? Math.round(revenueToday / ordersToday) : 0

      // 5. Hourly revenue breakdown (for chart)
      const [hourlyRows] = await req.db.query(
        `SELECT DATE_FORMAT(created_at, '%H:00') as hour, SUM(total_amount) as revenue 
         FROM orders 
         WHERE payment_status = 'paid' AND DATE(created_at) = CURDATE()
         GROUP BY hour 
         ORDER BY hour`
      )

      // 6. Top selling items today
      const [topItemRows] = await req.db.query(
        `SELECT m.name, SUM(oi.quantity) as quantity 
         FROM order_items oi 
         JOIN menu_items m ON oi.menu_item_id = m.id 
         JOIN orders o ON oi.order_id = o.id 
         WHERE o.payment_status = 'paid' AND DATE(o.created_at) = CURDATE()
         GROUP BY m.name 
         ORDER BY quantity DESC 
         LIMIT 5`
      )

      return res.json({
        revenueToday,
        revenueTrend: 0, // mock trend compared to yesterday
        ordersToday,
        ordersTrend: 0,
        activeTables,
        totalTables,
        avgOrderValue,
        avgTrend: 0,
        hourly: hourlyRows,
        topItems: topItemRows
      })
    } catch (error) {
      console.error('Get Stats Error:', error)
      return res.status(500).json({ message: 'Gagal memuat statistik.' })
    }
  })

  // 6. Get single order status for customer tracking
  router.get('/:id/status', async (req, res) => {
    const { id } = req.params

    try {
      const [rows] = await req.db.query(
        `SELECT o.*, t.table_number 
         FROM orders o 
         JOIN tables t ON o.table_id = t.id 
         WHERE o.id = ?`,
        [id]
      )

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })
      }

      const order = rows[0]

      // Fetch items
      const [items] = await req.db.query(
        `SELECT oi.quantity as qty, m.name 
         FROM order_items oi 
         JOIN menu_items m ON oi.menu_item_id = m.id 
         WHERE oi.order_id = ?`,
        [id]
      )

      return res.json({
        id: order.id,
        customerName: order.customer_name,
        tableNumber: order.table_number,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: order.total_amount,
        items
      })
    } catch (error) {
      console.error('Get Order Status Error:', error)
      return res.status(500).json({ message: 'Gagal mengambil status pesanan.' })
    }
  })

  return router
}
