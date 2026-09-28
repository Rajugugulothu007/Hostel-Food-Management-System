package com.hostel.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private LocalDateTime generatedAt;
    private List<MealCountDTO> mealCounts;
    private long totalSurplusToday;
    private long totalFeedbackToday;
    private String topMealToday;
}