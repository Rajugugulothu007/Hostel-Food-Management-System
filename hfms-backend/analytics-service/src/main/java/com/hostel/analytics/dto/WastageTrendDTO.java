package com.hostel.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WastageTrendDTO {
    private String period;      // "TODAY", "WEEK", "MONTH"
    private List<MealCountDTO> meals;
    private long totalSurplusQty;
    private double overallWastagePercent;
}