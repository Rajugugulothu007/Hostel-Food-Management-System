package com.hostel.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fcm_token",
        uniqueConstraints = @UniqueConstraint(columnNames = "student_id"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FcmToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false, unique = true)
    private Long studentId;

    @Column(nullable = false, length = 500)
    private String token;

    @Column(name = "device_info", length = 100)
    private String deviceInfo;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}