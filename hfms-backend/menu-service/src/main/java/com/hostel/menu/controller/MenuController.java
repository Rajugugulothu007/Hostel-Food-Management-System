package com.hostel.menu.controller;

import com.hostel.menu.dto.MenuItemDTO;
import com.hostel.menu.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDTO> create(@Valid @RequestBody MenuItemDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> listAll() {
        return ResponseEntity.ok(service.listAll());
    }

    @GetMapping("/today")
    public ResponseEntity<List<MenuItemDTO>> today(@RequestParam String mealType) {
        return ResponseEntity.ok(service.listByMealType(mealType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuItemDTO> update(@PathVariable String id,
                                              @Valid @RequestBody MenuItemDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}