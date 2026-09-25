package com.hostel.menu.service;

import com.hostel.menu.dto.MenuItemDTO;
import com.hostel.menu.entity.MenuItem;
import com.hostel.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository repo;

    public MenuItemDTO create(MenuItemDTO dto) {
        if (dto.getId() == null || dto.getId().isBlank()) {
            throw new RuntimeException("Meal ID is required (e.g., MEAL001)");
        }
        if (repo.existsById(dto.getId())) {
            throw new RuntimeException("Meal ID already exists: " + dto.getId());
        }

        MenuItem item = MenuItem.builder()
                .id(dto.getId())
                .itemName(dto.getItemName())
                .mealType(dto.getMealType())
                .quantity(dto.getQuantity())
                .dietaryTags(dto.getDietaryTags())
                .allergens(dto.getAllergens())
                .active(dto.getActive() == null ? true : dto.getActive())
                .createdAt(LocalDateTime.now())
                .build();

        return toDTO(repo.save(item));
    }

    public List<MenuItemDTO> listAll() {
        return repo.findByActiveTrue().stream().map(this::toDTO).toList();
    }

    public List<MenuItemDTO> listByMealType(String mealType) {
        return repo.findByMealTypeAndActiveTrue(mealType).stream().map(this::toDTO).toList();
    }

    public MenuItemDTO getById(String id) {
        MenuItem item = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + id));
        return toDTO(item);
    }

    public MenuItemDTO update(String id, MenuItemDTO dto) {
        MenuItem item = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + id));

        if (dto.getItemName() != null) item.setItemName(dto.getItemName());
        if (dto.getMealType() != null) item.setMealType(dto.getMealType());
        if (dto.getQuantity() != null) item.setQuantity(dto.getQuantity());
        if (dto.getDietaryTags() != null) item.setDietaryTags(dto.getDietaryTags());
        if (dto.getAllergens() != null) item.setAllergens(dto.getAllergens());
        if (dto.getActive() != null) item.setActive(dto.getActive());
        item.setUpdatedAt(LocalDateTime.now());

        return toDTO(repo.save(item));
    }

    public void delete(String id) {
        MenuItem item = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found: " + id));
        item.setActive(false);
        item.setUpdatedAt(LocalDateTime.now());
        repo.save(item);
    }

    private MenuItemDTO toDTO(MenuItem item) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(item.getId());
        dto.setItemName(item.getItemName());
        dto.setMealType(item.getMealType());
        dto.setQuantity(item.getQuantity());
        dto.setDietaryTags(item.getDietaryTags());
        dto.setAllergens(item.getAllergens());
        dto.setActive(item.getActive());
        return dto;
    }
}