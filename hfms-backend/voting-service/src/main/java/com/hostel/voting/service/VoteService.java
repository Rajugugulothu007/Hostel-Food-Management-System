package com.hostel.voting.service;

import com.hostel.voting.dto.VoteRequest;
import com.hostel.voting.dto.VoteResponse;
import com.hostel.voting.entity.Vote;
import com.hostel.voting.entity.VoteWindow;
import com.hostel.voting.repository.VoteRepository;
import com.hostel.voting.repository.VoteWindowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepo;
    private final VoteWindowRepository windowRepo;

    @Transactional
    public VoteResponse castVote(Long studentId, VoteRequest req) {
        LocalDate today = LocalDate.now();

        VoteWindow window = windowRepo
                .findByHostelIdAndMealTypeAndWindowDate(1L, req.getMealType(), today)
                .orElseThrow(() -> new RuntimeException("Vote window not found"));

        if (!"OPEN".equals(window.getStatus())) {
            throw new RuntimeException("Voting is closed for " + req.getMealType());
        }

        if (LocalDateTime.now().isAfter(window.getLocksAt())) {
            throw new RuntimeException("Voting window has expired");
        }

        var existing = voteRepo.findByStudentIdAndMealIdAndVoteDate(
                studentId, req.getMealId(), today);

        if (existing.isPresent()) {
            Vote v = existing.get();
            if (!v.getMealId().equals(req.getMealId())) {
                v.setMealId(req.getMealId());
                v.setChangedAt(LocalDateTime.now());
                voteRepo.save(v);
            }
            return new VoteResponse("UPDATED", req.getMealId(),
                    req.getMealType(), "Vote updated successfully");
        }

        Vote v = Vote.builder()
                .studentId(studentId)
                .mealId(req.getMealId())
                .voteDate(today)
                .votedAt(LocalDateTime.now())
                .build();
        voteRepo.save(v);

        return new VoteResponse("CREATED", req.getMealId(),
                req.getMealType(), "Vote cast successfully");
    }

    public long liveCount(String mealId) {
        return voteRepo.countByMealIdAndVoteDate(mealId, LocalDate.now());
    }
}