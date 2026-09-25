package com.hostel.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_credential")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String role;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}