-- Projects
CREATE TABLE client_projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    name VARCHAR(200),
    description TEXT,
    status ENUM('planned', 'in_progress', 'completed', 'on_hold'),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);