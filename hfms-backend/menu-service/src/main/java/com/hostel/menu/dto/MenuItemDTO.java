package com.hostel.menu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MenuItemDTO {

    private String id;

    @NotBlank
    private String itemName;

    @NotBlank
    private String mealType;

    private String quantity;
    private String dietaryTags;
    private String allergens;
    private Boolean active;
}