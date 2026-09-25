package com.hostel.voting.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vote_window")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VoteWindow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hostel_id", nullable = false)
    private Long hostelId;

    @Column(name = "meal_type", nullable = false)
    private String mealType;

    @Column(name = "window_date", nullable = false)
    private LocalDate windowDate;

    @Column(name = "opens_at")
    private LocalDateTime opensAt;

    @Column(name = "locks_at")
    private LocalDateTime locksAt;

    @Column(nullable = false)
    private String status;
}