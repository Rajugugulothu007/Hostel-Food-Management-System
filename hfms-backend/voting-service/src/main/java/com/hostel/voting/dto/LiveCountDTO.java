package com.hostel.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LiveCountDTO {
    private String mealId;
    private long count;
}