CREATE TABLE feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    meal_id VARCHAR(20) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    feedback_date DATE NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_feedback UNIQUE (student_id, meal_id, feedback_date)
);