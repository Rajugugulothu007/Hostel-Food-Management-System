package com.hostel.surplus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "surplus_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SurplusLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meal_id", nullable = false, length = 20)
    private String mealId;

    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType;

    @Column(name = "surplus_date", nullable = false)
    private LocalDate surplusDate;

    @Column(name = "prepared_qty")
    private Integer preparedQty;

    @Column(name = "served_qty")
    private Integer servedQty;

    @Column(name = "surplus_qty", nullable = false)
    private Integer surplusQty;

    @Column(name = "claim_window_end")
    private LocalDateTime claimWindowEnd;

    // DAY_SCHOLAR, NGO, COMPOST
    @Column(nullable = false, length = 20)
    private String disposition = "DAY_SCHOLAR";

    @Column(name = "claimed_by")
    private Long claimedBy;

    @Column(name = "logged_at")
    private LocalDateTime loggedAt;
}