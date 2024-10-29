-- Contact History
CREATE TABLE client_contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    contact_type ENUM('email', 'call', 'meeting', 'other'),
    subject VARCHAR(200),
    description TEXT,
    contact_date TIMESTAMP,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);