package com.hostel.voting.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VoteRequest {

    @NotNull
    private String mealId;

    @NotNull
    private String mealType;
}