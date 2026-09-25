package com.hostel.surplus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "claim")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "surplus_log_id", nullable = false)
    private Long surplusLogId;

    @Column(name = "day_scholar_id", nullable = false)
    private Long dayScholarId;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    @Column(name = "picked_up")
    private Boolean pickedUp = false;
}