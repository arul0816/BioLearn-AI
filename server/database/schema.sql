-- BioLearn AI Database Schema
-- Run this file to initialize the MySQL database

CREATE DATABASE IF NOT EXISTS biolearn_ai;
USE biolearn_ai;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    level ENUM('School', 'UG', 'PG') DEFAULT 'UG',
    avatar VARCHAR(255),
    total_xp INT DEFAULT 0,
    streak INT DEFAULT 0,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Modules Table
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    level ENUM('School', 'UG', 'PG') NOT NULL,
    content LONGTEXT NOT NULL,
    introduction TEXT,
    core_concepts TEXT,
    diagram_explanation TEXT,
    real_world_applications TEXT,
    summary TEXT,
    time_spent INT DEFAULT 0,
    mastery_score DECIMAL(5,2) DEFAULT 0.00,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_topic (topic),
    INDEX idx_level (level)
);

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT,
    topic VARCHAR(255) NOT NULL,
    level ENUM('School', 'UG', 'PG') NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    total_questions INT DEFAULT 0,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    time_taken INT,
    is_completed BOOLEAN DEFAULT FALSE,
    adaptive_recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_module_id (module_id)
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    user_answer ENUM('A', 'B', 'C', 'D'),
    explanation TEXT,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    is_correct BOOLEAN,
    points INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id)
);

-- Progress Table
CREATE TABLE IF NOT EXISTS progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id INT,
    quiz_id INT,
    topic VARCHAR(255) NOT NULL,
    action ENUM('module_started', 'module_completed', 'quiz_started', 'quiz_completed', 'topic_mastered') NOT NULL,
    score DECIMAL(5,2),
    time_spent INT DEFAULT 0,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_topic (topic),
    INDEX idx_action (action)
);

-- Topic Mastery Table (aggregated scores per topic per user)
CREATE TABLE IF NOT EXISTS topic_mastery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    mastery_score DECIMAL(5,2) DEFAULT 0.00,
    quiz_attempts INT DEFAULT 0,
    best_score DECIMAL(5,2) DEFAULT 0.00,
    total_time_spent INT DEFAULT 0,
    last_studied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_topic (user_id, topic),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Insert sample data
INSERT INTO users (name, email, password, level) VALUES
('Demo Student', 'demo@biolearn.ai', '$2a$12$demo_hashed_password', 'UG');