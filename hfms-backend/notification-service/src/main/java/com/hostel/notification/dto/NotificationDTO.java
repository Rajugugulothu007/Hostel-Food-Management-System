package com.hostel.notification.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private Long recipientId;
    private String type;
    private String title;
    private String body;
    private String channel;
    private String status;
    private LocalDateTime sentAt;
}