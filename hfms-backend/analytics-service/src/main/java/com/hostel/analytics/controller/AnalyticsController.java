package com.hostel.analytics.controller;

import com.hostel.analytics.dto.DashboardSummaryDTO;
import com.hostel.analytics.dto.WastageTrendDTO;
import com.hostel.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardSummaryDTO> dashboard(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(service.dashboard(authHeader));
    }

    @GetMapping("/wastage")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WastageTrendDTO> wastage(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(service.wastage(authHeader));
    }
}