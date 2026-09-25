package com.hostel.voting.controller;

import com.hostel.voting.dto.LiveCountDTO;
import com.hostel.voting.dto.VoteRequest;
import com.hostel.voting.dto.VoteResponse;
import com.hostel.voting.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService service;

    @PostMapping
    public ResponseEntity<VoteResponse> cast(@Valid @RequestBody VoteRequest req,
                                             Authentication auth) {
        Long studentId = (long) auth.getName().hashCode();
        return ResponseEntity.ok(service.castVote(studentId, req));
    }

    @GetMapping("/count/{mealId}")
    public ResponseEntity<LiveCountDTO> liveCount(@PathVariable String mealId) {
        return ResponseEntity.ok(new LiveCountDTO(mealId, service.liveCount(mealId)));
    }
}