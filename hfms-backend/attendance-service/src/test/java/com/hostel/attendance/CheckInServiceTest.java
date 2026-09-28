package com.hostel.attendance;

import com.hostel.attendance.dto.CheckInDTO;
import com.hostel.attendance.dto.CheckInRequest;
import com.hostel.attendance.entity.CheckIn;
import com.hostel.attendance.repository.CheckInRepository;
import com.hostel.attendance.service.CheckInService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CheckInServiceTest {

    @Mock private CheckInRepository repo;

    private CheckInService service;

    @BeforeEach
    void setUp() {
        service = new CheckInService(repo);
    }

    @Test
    void checkIn_new_savesRecord() {
        CheckInRequest req = new CheckInRequest();
        req.setStudentId(100L);
        req.setMealId("MEAL001");
        req.setMealType("BREAKFAST");

        when(repo.findByStudentIdAndMealIdAndCheckInDate(any(), any(), any()))
                .thenReturn(Optional.empty());
        when(repo.save(any(CheckIn.class))).thenAnswer(inv -> inv.getArgument(0));

        CheckInDTO result = service.checkIn(req);

        assertEquals(100L, result.getStudentId());
        assertEquals("MEAL001", result.getMealId());
        verify(repo, times(1)).save(any(CheckIn.class));
    }

    @Test
    void checkIn_duplicate_throws() {
        CheckInRequest req = new CheckInRequest();
        req.setStudentId(100L);
        req.setMealId("MEAL001");
        req.setMealType("BREAKFAST");

        CheckIn existing = CheckIn.builder().id(1L).build();
        when(repo.findByStudentIdAndMealIdAndCheckInDate(any(), any(), any()))
                .thenReturn(Optional.of(existing));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.checkIn(req));
        assertTrue(ex.getMessage().contains("Already checked in"));
    }

    @Test
    void headcount_returnsCount() {
        when(repo.countByMealIdAndCheckInDate(eq("MEAL001"), any())).thenReturn(42L);

        long count = service.headcount("MEAL001");
        assertEquals(42L, count);
    }

    @Test
    void todaySummary_returnsThreeMeals() {
        when(repo.findByMealTypeAndCheckInDate(any(), any())).thenReturn(java.util.List.of());

        var summary = service.todaySummary();
        assertEquals(3, summary.size());
    }
}