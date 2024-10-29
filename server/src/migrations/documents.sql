-- Documents
CREATE TABLE client_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    file_type VARCHAR(50),
    file_size INT,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);