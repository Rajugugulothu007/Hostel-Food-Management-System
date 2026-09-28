package com.hostel.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MealCountDTO {
    private String mealType;
    private long votes;
    private long checkIns;
    private double wastagePercent;
}