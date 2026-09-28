package com.hostel.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckInRequest {

    @NotNull
    private Long studentId;

    @NotBlank
    private String mealId;

    @NotBlank
    private String mealType;

    private Long counterId;
}