package com.hostel.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.user.controller.StudentController;
import com.hostel.user.dto.StudentDTO;
import com.hostel.user.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
@AutoConfigureMockMvc(addFilters = false)   // bypass JWT filter for controller tests
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService service;

    @Autowired
    private ObjectMapper objectMapper;

    // ---------- CREATE ----------

    @Test
    void create_returnsStudent() throws Exception {
        StudentDTO dto = new StudentDTO();
        dto.setName("Arjun");
        dto.setRollNo("22CS001");
        dto.setRoomNo("A101");

        StudentDTO saved = new StudentDTO();
        saved.setId(1L);
        saved.setName("Arjun");
        saved.setRollNo("22CS001");
        saved.setRoomNo("A101");
        saved.setActive(true);

        when(service.create(any(StudentDTO.class))).thenReturn(saved);

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Arjun"))
                .andExpect(jsonPath("$.rollNo").value("22CS001"));
    }

    @Test
    void create_missingName_returns400() throws Exception {
        StudentDTO dto = new StudentDTO();
        dto.setRollNo("22CS001");
        // name missing

        mockMvc.perform(post("/api/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // ---------- LIST ----------

    @Test
    void listAll_returnsList() throws Exception {
        StudentDTO s1 = new StudentDTO();
        s1.setId(1L); s1.setName("Arjun"); s1.setRollNo("22CS001");
        StudentDTO s2 = new StudentDTO();
        s2.setId(2L); s2.setName("Priya"); s2.setRollNo("22CS002");

        when(service.listAll()).thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Arjun"))
                .andExpect(jsonPath("$[1].name").value("Priya"));
    }

    // ---------- GET BY ID ----------

    @Test
    void getById_returnsStudent() throws Exception {
        StudentDTO dto = new StudentDTO();
        dto.setId(1L); dto.setName("Arjun"); dto.setRollNo("22CS001");

        when(service.getById(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Arjun"));
    }

    // ---------- UPDATE ----------

    @Test
    void update_returnsUpdatedStudent() throws Exception {
        StudentDTO dto = new StudentDTO();
        dto.setName("Arjun Kumar");
        dto.setRoomNo("A102");
        dto.setActive(true);

        StudentDTO updated = new StudentDTO();
        updated.setId(1L);
        updated.setName("Arjun Kumar");
        updated.setRollNo("22CS001");
        updated.setRoomNo("A102");
        updated.setActive(true);

        when(service.update(eq(1L), any(StudentDTO.class))).thenReturn(updated);

        mockMvc.perform(put("/api/students/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Arjun Kumar"))
                .andExpect(jsonPath("$.roomNo").value("A102"));
    }

    // ---------- DELETE ----------

    @Test
    void delete_returns204() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/students/1"))
                .andExpect(status().isNoContent());
    }
}