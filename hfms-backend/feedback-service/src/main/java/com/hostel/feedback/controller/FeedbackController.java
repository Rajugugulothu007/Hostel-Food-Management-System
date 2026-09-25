package com.hostel.feedback.controller;

import com.hostel.feedback.dto.FeedbackDTO;
import com.hostel.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService service;

    @PostMapping
    public ResponseEntity<FeedbackDTO> submit(@Valid @RequestBody FeedbackDTO dto,
                                              Authentication auth) {
        Long studentId = (long) auth.getName().hashCode();
        return ResponseEntity.ok(service.submit(studentId, dto));
    }

    @GetMapping("/item/{mealId}")
    public ResponseEntity<List<FeedbackDTO>> forMeal(@PathVariable String mealId) {
        return ResponseEntity.ok(service.forMeal(mealId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<FeedbackDTO>> myFeedback(Authentication auth) {
        Long studentId = (long) auth.getName().hashCode();
        return ResponseEntity.ok(service.myFeedback(studentId));
    }

    @GetMapping("/low-rated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> lowRated() {
        return ResponseEntity.ok(service.lowRated());
    }
}