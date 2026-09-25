package com.hostel.surplus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "day_scholar")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DayScholar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "college_id", nullable = false, unique = true)
    private String collegeId;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(name = "claim_count")
    private Integer claimCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}