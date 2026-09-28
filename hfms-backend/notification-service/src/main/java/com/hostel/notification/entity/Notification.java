package com.hostel.notification.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_id")
    private Long recipientId;   // null = broadcast to all

    @Column(nullable = false, length = 30)
    private String type;        // VOTE_REMINDER, VOTE_OPEN, MEAL_READY, SURPLUS

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 300)
    private String body;

    @Column(nullable = false, length = 20)
    private String channel;     // FCM, SMS, EMAIL

    @Column(nullable = false, length = 20)
    private String status;      // SENT, FAILED

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "error_message", length = 300)
    private String errorMessage;
}