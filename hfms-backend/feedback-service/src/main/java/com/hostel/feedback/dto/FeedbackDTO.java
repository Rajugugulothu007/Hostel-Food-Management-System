package com.hostel.feedback.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FeedbackDTO {

    private Long id;

    @NotBlank
    private String mealId;

    @NotBlank
    private String mealType;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    private String comment;
}