package com.hostel.menu;

import com.hostel.menu.dto.MenuItemDTO;
import com.hostel.menu.entity.MenuItem;
import com.hostel.menu.repository.MenuItemRepository;
import com.hostel.menu.service.MenuService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private MenuItemRepository repo;

    private MenuService service;

    @BeforeEach
    void setUp() {
        service = new MenuService(repo);
    }

    @Test
    void create_success_savesItem() {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId("MEAL100");
        dto.setItemName("Test Idli");
        dto.setMealType("BREAKFAST");
        dto.setQuantity("4 pcs");

        when(repo.existsById("MEAL100")).thenReturn(false);
        when(repo.save(any(MenuItem.class))).thenAnswer(inv -> inv.getArgument(0));

        MenuItemDTO result = service.create(dto);

        assertNotNull(result);
        assertEquals("MEAL100", result.getId());
        assertEquals("Test Idli", result.getItemName());
        verify(repo, times(1)).save(any(MenuItem.class));
    }

    @Test
    void create_duplicateId_throws() {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId("MEAL100");
        dto.setItemName("Test");
        dto.setMealType("BREAKFAST");

        when(repo.existsById("MEAL100")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.create(dto));
        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    void listAll_returnsActiveItems() {
        MenuItem item = MenuItem.builder()
                .id("MEAL001").itemName("Idli").mealType("BREAKFAST").active(true).build();

        when(repo.findByActiveTrue()).thenReturn(List.of(item));

        List<MenuItemDTO> result = service.listAll();

        assertEquals(1, result.size());
        assertEquals("MEAL001", result.get(0).getId());
    }

    @Test
    void listByMealType_returnsFiltered() {
        MenuItem item = MenuItem.builder()
                .id("MEAL001").itemName("Idli").mealType("BREAKFAST").active(true).build();

        when(repo.findByMealTypeAndActiveTrue("BREAKFAST")).thenReturn(List.of(item));

        List<MenuItemDTO> result = service.listByMealType("BREAKFAST");

        assertEquals(1, result.size());
        assertEquals("BREAKFAST", result.get(0).getMealType());
    }

    @Test
    void getById_found_returnsDTO() {
        MenuItem item = MenuItem.builder()
                .id("MEAL001").itemName("Idli").mealType("BREAKFAST").active(true).build();

        when(repo.findById("MEAL001")).thenReturn(Optional.of(item));

        MenuItemDTO result = service.getById("MEAL001");

        assertEquals("MEAL001", result.getId());
        assertEquals("Idli", result.getItemName());
    }

    @Test
    void getById_notFound_throws() {
        when(repo.findById("NOPE")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.getById("NOPE"));
        assertTrue(ex.getMessage().contains("not found"));
    }

    @Test
    void delete_softDeletes() {
        MenuItem item = MenuItem.builder()
                .id("MEAL001").itemName("Idli").mealType("BREAKFAST").active(true).build();

        when(repo.findById("MEAL001")).thenReturn(Optional.of(item));
        when(repo.save(any(MenuItem.class))).thenAnswer(inv -> inv.getArgument(0));

        service.delete("MEAL001");

        assertFalse(item.getActive());
        verify(repo, times(1)).save(item);
    }
}