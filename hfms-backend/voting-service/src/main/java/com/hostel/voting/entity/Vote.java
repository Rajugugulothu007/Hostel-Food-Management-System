package com.hostel.voting.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vote",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"student_id", "meal_id", "vote_date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "meal_id", nullable = false)
    private String mealId;

    @Column(name = "vote_date", nullable = false)
    private LocalDate voteDate;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;

    @Column(name = "changed_at")
    private LocalDateTime changedAt;
}