package com.hostel.notification.controller;

import com.hostel.notification.dto.FcmTokenRequest;
import com.hostel.notification.dto.NotificationDTO;
import com.hostel.notification.dto.NotificationRequest;
import com.hostel.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    /** Admin sends a manual broadcast or targeted notification */
    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> send(@Valid @RequestBody NotificationRequest req) {
        int sent = service.send(req);
        return ResponseEntity.ok(Map.of("sent", sent, "type", req.getType()));
    }

    /** Student's mobile app registers its FCM device token */
    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> registerToken(
            @Valid @RequestBody FcmTokenRequest req) {
        service.registerToken(req.getStudentId(), req.getToken(), req.getDeviceInfo());
        return ResponseEntity.ok(Map.of("status", "registered"));
    }

    /** Student views their notification history */
    @GetMapping("/my")
    public ResponseEntity<List<NotificationDTO>> my(Authentication auth) {
        Long studentId = (long) auth.getName().hashCode();
        return ResponseEntity.ok(service.historyForStudent(studentId));
    }

    /** Admin views all notifications (audit) */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NotificationDTO>> all() {
        return ResponseEntity.ok(service.all());
    }
}