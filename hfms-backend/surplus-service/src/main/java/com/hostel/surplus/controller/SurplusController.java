package com.hostel.surplus.controller;

import com.hostel.surplus.dto.DayScholarDTO;
import com.hostel.surplus.dto.SurplusLogDTO;
import com.hostel.surplus.service.SurplusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surplus")
@RequiredArgsConstructor
public class SurplusController {

    private final SurplusService service;

    // ---------- LOG SURPLUS (ADMIN) ----------

    @PostMapping("/log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SurplusLogDTO> log(@Valid @RequestBody SurplusLogDTO dto) {
        return ResponseEntity.ok(service.logSurplus(dto));
    }

    @GetMapping("/today")
    public ResponseEntity<List<SurplusLogDTO>> today() {
        return ResponseEntity.ok(service.today());
    }

    @GetMapping("/queue/ngo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SurplusLogDTO>> ngoQueue() {
        return ResponseEntity.ok(service.ngoQueue());
    }

    @PostMapping("/{id}/ngo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SurplusLogDTO> markForNgo(@PathVariable Long id) {
        return ResponseEntity.ok(service.markForNgo(id));
    }

    // ---------- DAY SCHOLAR ----------

    @PostMapping("/day-scholar/register")
    public ResponseEntity<DayScholarDTO> register(@Valid @RequestBody DayScholarDTO dto) {
        return ResponseEntity.ok(service.registerDayScholar(dto));
    }

    @GetMapping("/day-scholar/college/{collegeId}")
    public ResponseEntity<DayScholarDTO> getByCollegeId(@PathVariable String collegeId) {
        return ResponseEntity.ok(service.getDayScholarByCollegeId(collegeId));
    }

    // ---------- CLAIM ----------

    @PostMapping("/claim/{surplusLogId}/by/{dayScholarId}")
    public ResponseEntity<SurplusLogDTO> claim(@PathVariable Long surplusLogId,
                                               @PathVariable Long dayScholarId) {
        return ResponseEntity.ok(service.claim(surplusLogId, dayScholarId));
    }
}