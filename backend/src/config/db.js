import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const masterPool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cafeos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// Test connection to master
try {
  const connection = await masterPool.getConnection()
  console.log('Successfully connected to local Master MySQL database.')
  connection.release()
} catch (error) {
  console.error('Error connecting to Master MySQL database:', error.message)
}

const tenantPools = {}

export function getTenantPool(dbName) {
  if (!tenantPools[dbName]) {
    tenantPools[dbName] = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    })
  }
  return tenantPools[dbName]
}

export default masterPool

