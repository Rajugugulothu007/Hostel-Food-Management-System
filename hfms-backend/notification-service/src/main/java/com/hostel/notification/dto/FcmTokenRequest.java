package com.hostel.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FcmTokenRequest {

    @NotNull
    private Long studentId;

    @NotBlank
    private String token;

    private String deviceInfo;
}