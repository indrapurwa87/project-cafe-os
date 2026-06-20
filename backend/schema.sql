CREATE DATABASE IF NOT EXISTS cafeos;
USE cafeos;

-- Drop tables if they exist (in correct order of dependency)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS users;

-- 1. Tables Table (Meja)
CREATE TABLE tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT NOT NULL UNIQUE,
  qr_code_url VARCHAR(255) NULL,
  status VARCHAR(50) DEFAULT 'available',
  capacity INT DEFAULT 4,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Menu Items Table
CREATE TABLE menu_items (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  price INT NOT NULL,
  image_url VARCHAR(255) NULL,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Orders Table
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  table_id INT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, ready, done, cancelled
  total_amount INT NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, paid
  payment_method VARCHAR(50) NOT NULL, -- qris, gopay, ovo, cash, etc.
  payment_token VARCHAR(255) NULL,
  kitchen_note TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
);

-- 5. Order Items Table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  menu_item_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  notes VARCHAR(255) NULL,
  price INT NOT NULL,
  subtotal INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- 6. Users Table (Staff & Admins)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- admin, kitchen, waiter, cashier
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
