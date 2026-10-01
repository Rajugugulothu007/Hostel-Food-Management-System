package com.hostel.attendance.controller;

import com.hostel.attendance.dto.AttendanceSummaryDTO;
import com.hostel.attendance.dto.CheckInDTO;
import com.hostel.attendance.dto.CheckInRequest;
import com.hostel.attendance.service.CheckInService;
import com.hostel.attendance.service.QrCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final CheckInService service;
    private final QrCodeService qrCodeService;

    // ---------- QR CODE ----------

    /** Get personal QR PNG for a student */
    @GetMapping(value = "/qr/{studentId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQr(@PathVariable Long studentId) {
        String content = qrCodeService.buildStudentQrContent(studentId);
        byte[] png = qrCodeService.generateQrPng(content);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(png, headers, 200);
    }

    /** Verify a scanned QR text and return studentId if valid */
    @GetMapping("/qr/verify")
    public ResponseEntity<Map<String, Object>> verifyQr(@RequestParam String content) {
        Long studentId = qrCodeService.parseStudentId(content);
        if (studentId == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("valid", false, "reason", "Invalid QR format"));
        }
        return ResponseEntity.ok(Map.of("valid", true, "studentId", studentId));
    }

    // ---------- CHECK-IN ----------

    /** Admin scans QR → records check-in */
    @PostMapping("/checkin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CheckInDTO> checkIn(@Valid @RequestBody CheckInRequest req) {
        return ResponseEntity.ok(service.checkIn(req));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CheckInDTO>> today() {
        return ResponseEntity.ok(service.today());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CheckInDTO>> forStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(service.forStudent(studentId));
    }

    @GetMapping("/meal/{mealId}/count")
    public ResponseEntity<Map<String, Object>> headcount(@PathVariable String mealId) {
        long count = service.headcount(mealId);
        return ResponseEntity.ok(Map.of("mealId", mealId, "count", count));
    }

    @GetMapping("/summary/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceSummaryDTO>> summary() {
        return ResponseEntity.ok(service.todaySummary());
    }

    @GetMapping("/my/today")
    public ResponseEntity<List<CheckInDTO>> myToday(Authentication auth) {
        Long studentId = (long) auth.getName().hashCode();
        return ResponseEntity.ok(service.myToday(studentId));
    }
}