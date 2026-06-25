import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

// Routes imports
import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import tableRoutes from './routes/table.routes.js'
import orderRoutes from './routes/order.routes.js'
import userRoutes from './routes/user.routes.js'
import superRoutes from './routes/super.routes.js'
import { tenantMiddleware } from './middlewares/tenantMiddleware.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
  }
})

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

// Routes configuration
app.use('/api/super', superRoutes)
app.use('/api/auth', tenantMiddleware, authRoutes)
app.use('/api/menu', tenantMiddleware, menuRoutes)
app.use('/api/tables', tenantMiddleware, tableRoutes)
app.use('/api/orders', tenantMiddleware, orderRoutes(io))
app.use('/api/users', tenantMiddleware, userRoutes)

// Base Test Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CaféPOS API is running smoothly.' })
})

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack)
  res.status(500).json({ message: 'Terjadi kesalahan internal pada server.' })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`-----------------------------------------------------`)
  console.log(`☕ CaféPOS Backend Server running on port ${PORT}`)
  console.log(`➜ REST API: http://localhost:${PORT}/api`)
  console.log(`➜ WebSocket Server: ws://localhost:${PORT}`)
  console.log(`-----------------------------------------------------`)
})
