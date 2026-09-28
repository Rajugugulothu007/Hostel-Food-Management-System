CREATE TABLE check_in (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    meal_id VARCHAR(20) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    check_in_date DATE NOT NULL,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    counter_id BIGINT NULL,
    CONSTRAINT uq_checkin UNIQUE (student_id, meal_id, check_in_date)
);