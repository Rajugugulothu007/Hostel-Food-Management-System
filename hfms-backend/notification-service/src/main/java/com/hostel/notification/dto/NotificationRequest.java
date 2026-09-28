package com.hostel.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class NotificationRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String body;

    @NotBlank
    private String type;       // VOTE_REMINDER, VOTE_OPEN, etc.

    // null = broadcast to all students
    private List<Long> recipientIds;
}