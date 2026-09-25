package com.hostel.surplus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SurplusLogDTO {

    private Long id;

    @NotBlank
    private String mealId;

    @NotBlank
    private String mealType;

    private Integer preparedQty;
    private Integer servedQty;

    @NotNull
    private Integer surplusQty;

    private String disposition;
    private Long claimedBy;
}