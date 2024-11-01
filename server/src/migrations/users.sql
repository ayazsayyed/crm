CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users with different roles
-- Password: admin123
-- Password: manager123
-- Password: dev123
-- Password: user123
INSERT INTO users (username, email, password, role, created_at) VALUES
('Admin User', 'admin@example.com', '$2a$10$zPiUxqEtGC9RqZDTFrXHDuGz/4v4UYXWT5Ly5ZGqm5gS0FN8CL6rW', 'admin', NOW()),
('Project Manager', 'manager@example.com', '$2a$10$YourHashHere', 'manager', NOW()),
('John Developer', 'john.dev@example.com', '$2a$10$YourHashHere', 'developer', NOW()),
('Sarah Developer', 'sarah.dev@example.com', '$2a$10$YourHashHere', 'developer', NOW()),
('Mike Developer', 'mike.dev@example.com', '$2a$10$YourHashHere', 'developer', NOW()),
('Alice Cooper', 'alice@example.com', '$2a$10$YourHashHere', 'user', NOW()),
('Bob Wilson', 'bob@example.com', '$2a$10$YourHashHere', 'user', NOW()),
('Charlie Brown', 'charlie@example.com', '$2a$10$YourHashHere', 'user', NOW());

-- If you need to update the roles enum
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'developer', 'user') DEFAULT 'user';

-- You can verify the users were created with:
SELECT id, username, email, role, created_at FROM users;


-- Admin: admin@example.com / Test@123
-- Manager: john.manager@example.com / Test@123
-- Developer: alex.dev@example.com / Test@123
-- User: tom@example.com / Test@123


-- Add user profiles table if you want to store more user information
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    department VARCHAR(50),
    job_title VARCHAR(100),
    avatar_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- Insert some profile data
INSERT INTO user_profiles (user_id, first_name, last_name, department, job_title) 
SELECT id, 
    SUBSTRING_INDEX(username, ' ', 1) as first_name,
    SUBSTRING_INDEX(username, ' ', -1) as last_name,
    CASE 
        WHEN role = 'developer' THEN 'Engineering'
        WHEN role = 'manager' THEN 'Management'
        ELSE 'General'
    END as department,
    CASE 
        WHEN role = 'developer' THEN 'Software Engineer'
        WHEN role = 'manager' THEN 'Project Manager'
        WHEN role = 'admin' THEN 'System Administrator'
        ELSE 'Team Member'
    END as job_title
FROM users;