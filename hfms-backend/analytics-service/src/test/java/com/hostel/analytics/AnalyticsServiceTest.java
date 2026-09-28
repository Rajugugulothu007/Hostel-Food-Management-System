package com.hostel.analytics;

import com.hostel.analytics.client.ServiceClient;
import com.hostel.analytics.dto.DashboardSummaryDTO;
import com.hostel.analytics.dto.WastageTrendDTO;
import com.hostel.analytics.service.AnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock private ServiceClient client;

    private AnalyticsService service;

    @BeforeEach
    void setUp() {
        service = new AnalyticsService(client);
    }

    @Test
    void dashboard_aggregatesCounts() {
        when(client.getVoteCount(any(), any())).thenReturn(Map.of("count", 100));
        when(client.getCheckInCount(any(), any())).thenReturn(Map.of("count", 90));
        when(client.getTodaySurplus(any())).thenReturn(List.of());
        when(client.getTodayFeedback(any(), any())).thenReturn(List.of());

        DashboardSummaryDTO result = service.dashboard("Bearer token");

        assertNotNull(result);
        assertEquals(3, result.getMealCounts().size());
        assertTrue(result.getTotalFeedbackToday() >= 0);
    }

    @Test
    void dashboard_handlesDownstreamFailure() {
        when(client.getVoteCount(any(), any()))
                .thenThrow(new RuntimeException("connection refused"));
        when(client.getCheckInCount(any(), any()))
                .thenThrow(new RuntimeException("connection refused"));
        when(client.getTodaySurplus(any())).thenReturn(List.of());
        when(client.getTodayFeedback(any(), any())).thenReturn(List.of());

        // Should NOT throw even if downstream services fail
        DashboardSummaryDTO result = service.dashboard("Bearer token");

        assertNotNull(result);
        assertEquals(3, result.getMealCounts().size());
    }

    @Test
    void wastage_returnsTrend() {
        when(client.getVoteCount(any(), any())).thenReturn(Map.of("count", 100));
        when(client.getCheckInCount(any(), any())).thenReturn(Map.of("count", 80));
        when(client.getTodaySurplus(any())).thenReturn(List.of());
        when(client.getTodayFeedback(any(), any())).thenReturn(List.of());

        WastageTrendDTO result = service.wastage("Bearer token");

        assertNotNull(result);
        assertEquals("TODAY", result.getPeriod());
        assertTrue(result.getOverallWastagePercent() > 0);
    }
}