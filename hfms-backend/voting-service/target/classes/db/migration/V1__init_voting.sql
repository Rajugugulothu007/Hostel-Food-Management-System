CREATE TABLE vote_window (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hostel_id BIGINT NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    window_date DATE NOT NULL,
    opens_at TIMESTAMP NULL,
    locks_at TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE vote (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    meal_id VARCHAR(20) NOT NULL,
    vote_date DATE NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_at TIMESTAMP NULL,
    CONSTRAINT uq_vote UNIQUE (student_id, meal_id, vote_date)
);

INSERT INTO vote_window (hostel_id, meal_type, window_date, opens_at, locks_at, status)
VALUES
    (1, 'BREAKFAST', CURDATE(), NOW() - INTERVAL 12 HOUR, NOW() + INTERVAL 12 HOUR, 'OPEN'),
    (1, 'LUNCH',     CURDATE(), NOW() - INTERVAL 2 HOUR,  NOW() + INTERVAL 6 HOUR,  'OPEN'),
    (1, 'DINNER',    CURDATE(), NOW() - INTERVAL 1 HOUR,  NOW() + INTERVAL 8 HOUR,  'OPEN');