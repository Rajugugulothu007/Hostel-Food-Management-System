package com.hostel.analytics;

import com.hostel.analytics.controller.AnalyticsController;
import com.hostel.analytics.dto.DashboardSummaryDTO;
import com.hostel.analytics.dto.MealCountDTO;
import com.hostel.analytics.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AnalyticsController.class)
@AutoConfigureMockMvc(addFilters = false)
class AnalyticsControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private AnalyticsService service;

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void dashboard_returnsSummary() throws Exception {
        DashboardSummaryDTO dto = new DashboardSummaryDTO(
                LocalDateTime.now(),
                List.of(new MealCountDTO("BREAKFAST", 100, 87, 13.0)),
                8,
                12,
                "BREAKFAST"
        );
        when(service.dashboard(any())).thenReturn(dto);

        mockMvc.perform(get("/api/analytics/dashboard")
                        .header("Authorization", "Bearer test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topMealToday").value("BREAKFAST"))
                .andExpect(jsonPath("$.totalSurplusToday").value(8))
                .andExpect(jsonPath("$.mealCounts[0].mealType").value("BREAKFAST"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void wastage_returnsTrend() throws Exception {
        when(service.wastage(any())).thenReturn(
                new com.hostel.analytics.dto.WastageTrendDTO(
                        "TODAY", List.of(), 8, 13.0));

        mockMvc.perform(get("/api/analytics/wastage")
                        .header("Authorization", "Bearer test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.period").value("TODAY"));
    }
}