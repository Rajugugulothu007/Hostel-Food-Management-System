ALTER TABLE student
ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'HOSTELLER';

-- Optional: index for faster filtering
CREATE INDEX idx_student_type ON student(type);