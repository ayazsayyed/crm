-- Notes
CREATE TABLE client_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    note TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);