package com.hostel.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"student_id", "meal_id", "check_in_date"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "meal_id", nullable = false, length = 20)
    private String mealId;

    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "counter_id")
    private Long counterId;
}