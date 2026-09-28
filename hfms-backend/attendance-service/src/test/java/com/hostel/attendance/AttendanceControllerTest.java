package com.hostel.attendance;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.attendance.controller.AttendanceController;
import com.hostel.attendance.dto.CheckInDTO;
import com.hostel.attendance.dto.CheckInRequest;
import com.hostel.attendance.service.CheckInService;
import com.hostel.attendance.service.QrCodeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AttendanceController.class)
@AutoConfigureMockMvc(addFilters = false)
class AttendanceControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private CheckInService service;
    @MockBean private QrCodeService qrCodeService;
    @Autowired private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void checkIn_returnsDTO() throws Exception {
        CheckInRequest req = new CheckInRequest();
        req.setStudentId(100L);
        req.setMealId("MEAL001");
        req.setMealType("BREAKFAST");

        CheckInDTO saved = new CheckInDTO();
        saved.setId(1L);
        saved.setStudentId(100L);
        saved.setMealId("MEAL001");

        when(service.checkIn(any(CheckInRequest.class))).thenReturn(saved);

        mockMvc.perform(post("/api/attendance/checkin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.studentId").value(100))
                .andExpect(jsonPath("$.mealId").value("MEAL001"));
    }

    @Test
    void headcount_returnsCount() throws Exception {
        when(service.headcount("MEAL001")).thenReturn(87L);

        mockMvc.perform(get("/api/attendance/meal/MEAL001/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(87));
    }

    @Test
    void qrVerify_valid() throws Exception {
        when(qrCodeService.parseStudentId("HFMS-STUDENT-100")).thenReturn(100L);

        mockMvc.perform(get("/api/attendance/qr/verify").param("content", "HFMS-STUDENT-100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.studentId").value(100));
    }

    @Test
    void qrVerify_invalid() throws Exception {
        when(qrCodeService.parseStudentId("garbage")).thenReturn(null);

        mockMvc.perform(get("/api/attendance/qr/verify").param("content", "garbage"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.valid").value(false));
    }
}