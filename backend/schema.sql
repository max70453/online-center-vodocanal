-- Create database
CREATE DATABASE IF NOT EXISTS heating_center CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE heating_center;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    tariff_id INT,
    tariff_selected_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Tariffs table
CREATE TABLE IF NOT EXISTS tariffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('residential', 'commercial', 'industrial') NOT NULL,
    price_per_sqm DECIMAL(10,2) NOT NULL,
    description TEXT,
    features TEXT,
    is_base BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Account balances table
CREATE TABLE IF NOT EXISTS account_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    last_payment_date DATETIME,
    next_payment_date DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payment history table
CREATE TABLE IF NOT EXISTS payment_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tariff_id INT,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('payment', 'charge') NOT NULL,
    payment_method VARCHAR(50),
    description TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tariff_id) REFERENCES tariffs(id) ON DELETE SET NULL
);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'normal', 'high') NOT NULL DEFAULT 'normal',
    status ENUM('open', 'in_progress', 'closed') NOT NULL DEFAULT 'open',
    created_at DATETIME NOT NULL,
    closed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Support ticket responses table
CREATE TABLE IF NOT EXISTS support_ticket_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert base tariffs
INSERT INTO tariffs (name, category, price_per_sqm, description, features, is_base, created_at) VALUES
('Базовый тариф для жилых помещений', 'residential', 45.50, 'Стандартный тариф для жилых помещений', '["Круглосуточное отопление", "Ежемесячные показания счетчика", "Онлайн-оплата"]', TRUE, NOW()),
('Базовый тариф для коммерческих помещений', 'commercial', 55.75, 'Стандартный тариф для коммерческих помещений', '["Круглосуточное отопление", "Ежемесячные показания счетчика", "Онлайн-оплата", "Приоритетная поддержка"]', TRUE, NOW()),
('Базовый тариф для промышленных объектов', 'industrial', 65.25, 'Стандартный тариф для промышленных объектов', '["Круглосуточное отопление", "Ежемесячные показания счетчика", "Онлайн-оплата", "Приоритетная поддержка", "Техническое обслуживание"]', TRUE, NOW()); 