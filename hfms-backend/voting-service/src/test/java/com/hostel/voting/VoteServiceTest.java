package com.hostel.voting;

import com.hostel.voting.dto.VoteRequest;
import com.hostel.voting.dto.VoteResponse;
import com.hostel.voting.entity.Vote;
import com.hostel.voting.entity.VoteWindow;
import com.hostel.voting.repository.VoteRepository;
import com.hostel.voting.repository.VoteWindowRepository;
import com.hostel.voting.service.VoteService;      // ← must be here
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock private VoteRepository voteRepo;
    @Mock private VoteWindowRepository windowRepo;

    private VoteService service;

    @BeforeEach
    void setUp() {
        service = new VoteService(voteRepo, windowRepo);
    }

    private VoteWindow openWindow(String mealType) {
        return VoteWindow.builder()
                .id(1L)
                .hostelId(1L)
                .mealType(mealType)
                .windowDate(LocalDate.now())
                .opensAt(LocalDateTime.now().minusHours(1))
                .locksAt(LocalDateTime.now().plusHours(4))
                .status("OPEN")
                .build();
    }

    @Test
    void castVote_newVote_savesToDb() {
        VoteRequest req = new VoteRequest();
        req.setMealId("MEAL001");
        req.setMealType("BREAKFAST");

        when(windowRepo.findByHostelIdAndMealTypeAndWindowDate(eq(1L), eq("BREAKFAST"), any()))
                .thenReturn(Optional.of(openWindow("BREAKFAST")));
        when(voteRepo.findByStudentIdAndMealIdAndVoteDate(any(), eq("MEAL001"), any()))
                .thenReturn(Optional.empty());
        when(voteRepo.save(any(Vote.class))).thenAnswer(inv -> inv.getArgument(0));

        VoteResponse res = service.castVote(100L, req);

        assertEquals("CREATED", res.getStatus());
        assertEquals("MEAL001", res.getMealId());
        verify(voteRepo, times(1)).save(any(Vote.class));
    }

    @Test
    void castVote_windowNotFound_throws() {
        VoteRequest req = new VoteRequest();
        req.setMealId("MEAL001");
        req.setMealType("BREAKFAST");

        when(windowRepo.findByHostelIdAndMealTypeAndWindowDate(any(), any(), any()))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.castVote(100L, req));
        assertEquals("Vote window not found", ex.getMessage());
    }

    @Test
    void liveCount_returnsDbValue() {
        when(voteRepo.countByMealIdAndVoteDate(eq("MEAL001"), any())).thenReturn(42L);

        long count = service.liveCount("MEAL001");

        assertEquals(42L, count);
    }
}