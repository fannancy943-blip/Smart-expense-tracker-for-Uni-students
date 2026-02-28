-- Create database
CREATE DATABASE IF NOT EXISTS unitracker;
USE unitracker;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(400) NOT NULL,
  email VARCHAR(400) UNIQUE NOT NULL,
  password VARCHAR(450) NOT NULL,
  profile_photo TEXT,
  budget DECIMAL(10,2) DEFAULT 0.00,
  alert_threshold INT DEFAULT 75,
  email_alerts BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  description VARCHAR(300) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Savings goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(350) NOT NULL,
  target DECIMAL(10,2) NOT NULL,
  current DECIMAL(10,2) DEFAULT 0.00,
  icon VARCHAR(10) DEFAULT '🎯',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);