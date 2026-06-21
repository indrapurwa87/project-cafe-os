CREATE DATABASE IF NOT EXISTS cafeos;
USE cafeos;

CREATE TABLE IF NOT EXISTS tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  db_name VARCHAR(100) UNIQUE NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  owner_email VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, expired
  plan VARCHAR(50) DEFAULT 'monthly', -- monthly, yearly
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
