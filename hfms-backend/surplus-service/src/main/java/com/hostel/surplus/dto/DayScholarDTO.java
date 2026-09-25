package com.hostel.surplus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DayScholarDTO {

    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String collegeId;

    @NotBlank
    private String phone;

    private Integer claimCount;
}