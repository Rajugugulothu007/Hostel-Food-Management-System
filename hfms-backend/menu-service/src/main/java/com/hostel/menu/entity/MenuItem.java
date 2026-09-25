package com.hostel.menu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "menu_item")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {

    @Id
    @Column(name = "id", length = 20)
    private String id;   // e.g., "MEAL001"

    @Column(name = "item_name", nullable = false)
    private String itemName;   // "Idli + Sambar + Coconut Chutney"

    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType;   // BREAKFAST, LUNCH, DINNER

    @Column(name = "quantity", length = 100)
    private String quantity;   // "4 pcs + 150ml + 50ml"

    @Column(name = "dietary_tags", length = 100)
    private String dietaryTags;   // "veg,gluten-free"

    @Column(name = "allergens", length = 100)
    private String allergens;   // "dairy,nuts"

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}