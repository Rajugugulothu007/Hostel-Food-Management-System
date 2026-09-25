package com.hostel.feedback.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "meal_id", nullable = false, length = 20)
    private String mealId;

    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType;

    @Column(name = "feedback_date", nullable = false)
    private LocalDate feedbackDate;

    @Column(nullable = false)
    private Integer rating;   // 1 to 5

    @Column(length = 500)
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}