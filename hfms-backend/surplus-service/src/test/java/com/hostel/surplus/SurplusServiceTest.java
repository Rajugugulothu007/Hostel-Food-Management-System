package com.hostel.surplus;

import com.hostel.surplus.dto.DayScholarDTO;
import com.hostel.surplus.dto.SurplusLogDTO;
import com.hostel.surplus.entity.Claim;
import com.hostel.surplus.entity.DayScholar;
import com.hostel.surplus.entity.SurplusLog;
import com.hostel.surplus.repository.ClaimRepository;
import com.hostel.surplus.repository.DayScholarRepository;
import com.hostel.surplus.repository.SurplusLogRepository;
import com.hostel.surplus.service.SurplusService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SurplusServiceTest {

    @Mock private SurplusLogRepository surplusRepo;
    @Mock private DayScholarRepository dayScholarRepo;
    @Mock private ClaimRepository claimRepo;

    private SurplusService service;

    @BeforeEach
    void setUp() {
        service = new SurplusService(surplusRepo, dayScholarRepo, claimRepo);
    }

    // ---------- LOG SURPLUS ----------

    @Test
    void logSurplus_createsLog() {
        SurplusLogDTO dto = new SurplusLogDTO();
        dto.setMealId("MEAL001");
        dto.setMealType("BREAKFAST");
        dto.setSurplusQty(5);

        when(surplusRepo.save(any(SurplusLog.class))).thenAnswer(inv -> inv.getArgument(0));

        SurplusLogDTO result = service.logSurplus(dto);

        assertEquals("MEAL001", result.getMealId());
        assertEquals(5, result.getSurplusQty());
        assertEquals("DAY_SCHOLAR", result.getDisposition());
    }

    // ---------- REGISTER DAY SCHOLAR ----------

    @Test
    void registerDayScholar_success() {
        DayScholarDTO dto = new DayScholarDTO();
        dto.setName("Ravi");
        dto.setCollegeId("C001");
        dto.setPhone("9000000001");

        when(dayScholarRepo.existsByCollegeId("C001")).thenReturn(false);
        when(dayScholarRepo.save(any(DayScholar.class))).thenAnswer(inv -> {
            DayScholar ds = inv.getArgument(0);
            ds.setId(1L);
            return ds;
        });

        DayScholarDTO result = service.registerDayScholar(dto);

        assertEquals("Ravi", result.getName());
        assertEquals(1L, result.getId());
        assertEquals(0, result.getClaimCount());
    }

    @Test
    void registerDayScholar_duplicate_throws() {
        DayScholarDTO dto = new DayScholarDTO();
        dto.setName("Ravi");
        dto.setCollegeId("C001");
        dto.setPhone("9000000001");

        when(dayScholarRepo.existsByCollegeId("C001")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.registerDayScholar(dto));
        assertEquals("College ID already registered", ex.getMessage());
        verify(dayScholarRepo, never()).save(any());
    }

    // ---------- GET DAY SCHOLAR BY COLLEGE ID ----------

    @Test
    void getDayScholarByCollegeId_returnsDTO() {
        DayScholar ds = DayScholar.builder()
                .id(1L)
                .name("Ravi")
                .collegeId("DS001")
                .phone("9000000001")
                .claimCount(0)
                .build();

        when(dayScholarRepo.findByCollegeId("DS001")).thenReturn(Optional.of(ds));

        DayScholarDTO result = service.getDayScholarByCollegeId("DS001");

        assertEquals(1L, result.getId());
        assertEquals("Ravi", result.getName());
        assertEquals("DS001", result.getCollegeId());
        assertEquals("9000000001", result.getPhone());
        assertEquals(0, result.getClaimCount());
    }

    @Test
    void getDayScholarByCollegeId_notFound_throws() {
        when(dayScholarRepo.findByCollegeId("NOPE")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.getDayScholarByCollegeId("NOPE"));
        assertTrue(ex.getMessage().contains("not found"));
    }

    // ---------- CLAIM ----------

    @Test
    void claim_success() {
        SurplusLog log = SurplusLog.builder()
                .id(1L)
                .mealId("MEAL001")
                .mealType("BREAKFAST")
                .surplusQty(5)
                .claimWindowEnd(LocalDateTime.now().plusMinutes(10))
                .disposition("DAY_SCHOLAR")
                .build();

        DayScholar ds = DayScholar.builder()
                .id(10L)
                .name("Ravi")
                .collegeId("DS001")
                .phone("9000000001")
                .claimCount(0)
                .build();

        when(surplusRepo.findById(1L)).thenReturn(Optional.of(log));
        when(claimRepo.findBySurplusLogId(1L)).thenReturn(Optional.empty());
        when(dayScholarRepo.findById(10L)).thenReturn(Optional.of(ds));
        when(claimRepo.save(any(Claim.class))).thenAnswer(inv -> inv.getArgument(0));
        when(surplusRepo.save(any(SurplusLog.class))).thenAnswer(inv -> inv.getArgument(0));
        when(dayScholarRepo.save(any(DayScholar.class))).thenAnswer(inv -> inv.getArgument(0));

        SurplusLogDTO result = service.claim(1L, 10L);

        assertEquals(10L, result.getClaimedBy());
        assertEquals(1, ds.getClaimCount());
        verify(claimRepo, times(1)).save(any(Claim.class));
        verify(surplusRepo, times(1)).save(any(SurplusLog.class));
        verify(dayScholarRepo, times(1)).save(any(DayScholar.class));
    }

    @Test
    void claim_windowClosed_throws() {
        SurplusLog log = SurplusLog.builder()
                .id(1L)
                .surplusQty(5)
                .claimWindowEnd(LocalDateTime.now().minusMinutes(5))
                .build();

        when(surplusRepo.findById(1L)).thenReturn(Optional.of(log));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.claim(1L, 10L));
        assertTrue(ex.getMessage().contains("Claim window closed"));
    }

    @Test
    void claim_noSurplus_throws() {
        SurplusLog log = SurplusLog.builder()
                .id(1L)
                .surplusQty(0)
                .claimWindowEnd(LocalDateTime.now().plusMinutes(10))
                .build();

        when(surplusRepo.findById(1L)).thenReturn(Optional.of(log));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.claim(1L, 10L));
        assertTrue(ex.getMessage().contains("No surplus"));
    }

    @Test
    void claim_alreadyClaimed_throws() {
        SurplusLog log = SurplusLog.builder()
                .id(1L)
                .surplusQty(5)
                .claimWindowEnd(LocalDateTime.now().plusMinutes(10))
                .build();

        Claim existing = Claim.builder().id(1L).surplusLogId(1L).build();

        when(surplusRepo.findById(1L)).thenReturn(Optional.of(log));
        when(claimRepo.findBySurplusLogId(1L)).thenReturn(Optional.of(existing));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.claim(1L, 10L));
        assertTrue(ex.getMessage().contains("already claimed"));
    }

    // ---------- MARK FOR NGO ----------

    @Test
    void markForNgo_updatesDisposition() {
        SurplusLog log = SurplusLog.builder()
                .id(1L)
                .mealId("MEAL001")
                .surplusQty(5)
                .disposition("DAY_SCHOLAR")
                .build();

        when(surplusRepo.findById(1L)).thenReturn(Optional.of(log));
        when(surplusRepo.save(any(SurplusLog.class))).thenAnswer(inv -> inv.getArgument(0));

        SurplusLogDTO result = service.markForNgo(1L);

        assertEquals("NGO", result.getDisposition());
        verify(surplusRepo, times(1)).save(log);
    }
}