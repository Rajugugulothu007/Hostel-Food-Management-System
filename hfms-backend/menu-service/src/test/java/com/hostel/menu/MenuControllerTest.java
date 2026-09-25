package com.hostel.menu;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.menu.controller.MenuController;
import com.hostel.menu.dto.MenuItemDTO;
import com.hostel.menu.service.MenuService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MenuController.class)
@AutoConfigureMockMvc(addFilters = false)
class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MenuService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void create_returnsItem() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId("MEAL100");
        dto.setItemName("Idli");
        dto.setMealType("BREAKFAST");

        MenuItemDTO saved = new MenuItemDTO();
        saved.setId("MEAL100");
        saved.setItemName("Idli");
        saved.setMealType("BREAKFAST");
        saved.setActive(true);

        when(service.create(any(MenuItemDTO.class))).thenReturn(saved);

        mockMvc.perform(post("/api/menu")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("MEAL100"))
                .andExpect(jsonPath("$.itemName").value("Idli"));
    }

    @Test
    void listAll_returnsList() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId("MEAL001");
        dto.setItemName("Idli");
        dto.setMealType("BREAKFAST");
        dto.setActive(true);

        when(service.listAll()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("MEAL001"));
    }

    @Test
    void today_returnsFilteredList() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId("MEAL001");
        dto.setItemName("Idli");
        dto.setMealType("BREAKFAST");
        dto.setActive(true);

        when(service.listByMealType("BREAKFAST")).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/menu/today").param("mealType", "BREAKFAST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].mealType").value("BREAKFAST"));
    }

    @Test
    void getById_returnsItem() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId("MEAL001");
        dto.setItemName("Idli");
        dto.setMealType("BREAKFAST");

        when(service.getById("MEAL001")).thenReturn(dto);

        mockMvc.perform(get("/api/menu/MEAL001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("MEAL001"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void delete_returns204() throws Exception {
        doNothing().when(service).delete("MEAL001");

        mockMvc.perform(delete("/api/menu/MEAL001"))
                .andExpect(status().isNoContent());
    }
}