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
    private String id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "meal_type", nullable = false, length = 20)
    private String mealType;

    @Column(name = "quantity", length = 100)
    private String quantity;

    @Column(name = "dietary_tags", length = 100)
    private String dietaryTags;

    @Column(name = "allergens", length = 100)
    private String allergens;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}