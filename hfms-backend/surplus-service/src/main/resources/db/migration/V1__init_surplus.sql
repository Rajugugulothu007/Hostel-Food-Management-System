CREATE TABLE surplus_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meal_id VARCHAR(20) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    surplus_date DATE NOT NULL,
    prepared_qty INT,
    served_qty INT,
    surplus_qty INT NOT NULL,
    claim_window_end TIMESTAMP NULL,
    disposition VARCHAR(20) NOT NULL DEFAULT 'DAY_SCHOLAR',
    claimed_by BIGINT NULL,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE day_scholar (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    college_id VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    claim_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claim (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    surplus_log_id BIGINT NOT NULL,
    day_scholar_id BIGINT NOT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    picked_up BOOLEAN DEFAULT FALSE
);