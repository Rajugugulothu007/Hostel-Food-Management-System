package com.hostel.attendance.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CheckInDTO {

    private Long id;
    private Long studentId;
    private String mealId;
    private String mealType;
    private LocalDate checkInDate;
    private LocalDateTime checkInTime;
    private Long counterId;
}