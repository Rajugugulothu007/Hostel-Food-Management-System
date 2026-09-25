package com.hostel.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentDTO {

    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String rollNo;

    private String roomNo;
    private String phone;
    private String email;
    private Long hostelId;
    private Boolean active;
}