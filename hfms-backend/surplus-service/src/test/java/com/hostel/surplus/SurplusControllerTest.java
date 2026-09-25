package com.hostel.surplus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.surplus.controller.SurplusController;
import com.hostel.surplus.dto.DayScholarDTO;
import com.hostel.surplus.dto.SurplusLogDTO;
import com.hostel.surplus.service.SurplusService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SurplusController.class)
@AutoConfigureMockMvc(addFilters = false)
class SurplusControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private SurplusService service;
    @Autowired private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void logSurplus_returnsLog() throws Exception {
        SurplusLogDTO dto = new SurplusLogDTO();
        dto.setMealId("MEAL001");
        dto.setMealType("BREAKFAST");
        dto.setSurplusQty(5);

        SurplusLogDTO saved = new SurplusLogDTO();
        saved.setId(1L);
        saved.setMealId("MEAL001");
        saved.setSurplusQty(5);
        saved.setDisposition("DAY_SCHOLAR");

        when(service.logSurplus(any(SurplusLogDTO.class))).thenReturn(saved);

        mockMvc.perform(post("/api/surplus/log")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.surplusQty").value(5));
    }

    @Test
    void today_returnsList() throws Exception {
        when(service.today()).thenReturn(List.of());

        mockMvc.perform(get("/api/surplus/today"))
                .andExpect(status().isOk());
    }

    @Test
    void registerDayScholar_returnsDTO() throws Exception {
        DayScholarDTO dto = new DayScholarDTO();
        dto.setName("Ravi");
        dto.setCollegeId("C001");
        dto.setPhone("9000000001");

        DayScholarDTO saved = new DayScholarDTO();
        saved.setId(1L);
        saved.setName("Ravi");
        saved.setCollegeId("C001");
        saved.setPhone("9000000001");

        when(service.registerDayScholar(any(DayScholarDTO.class))).thenReturn(saved);

        mockMvc.perform(post("/api/surplus/day-scholar/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getByCollegeId_returnsDayScholar() throws Exception {
        DayScholarDTO dto = new DayScholarDTO();
        dto.setId(1L);
        dto.setName("Ravi");
        dto.setCollegeId("DS001");
        dto.setPhone("9000000001");
        dto.setClaimCount(0);

        when(service.getDayScholarByCollegeId("DS001")).thenReturn(dto);

        mockMvc.perform(get("/api/surplus/day-scholar/college/DS001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.collegeId").value("DS001"))
                .andExpect(jsonPath("$.name").value("Ravi"));
    }

    @Test
    void claim_returnsLog() throws Exception {
        SurplusLogDTO log = new SurplusLogDTO();
        log.setId(1L);
        log.setClaimedBy(10L);

        when(service.claim(1L, 10L)).thenReturn(log);

        mockMvc.perform(post("/api/surplus/claim/1/by/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.claimedBy").value(10));
    }
}