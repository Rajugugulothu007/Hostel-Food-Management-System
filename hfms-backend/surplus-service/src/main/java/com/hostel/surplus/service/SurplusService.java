package com.hostel.surplus.service;

import com.hostel.surplus.dto.DayScholarDTO;
import com.hostel.surplus.dto.SurplusLogDTO;
import com.hostel.surplus.entity.Claim;
import com.hostel.surplus.entity.DayScholar;
import com.hostel.surplus.entity.SurplusLog;
import com.hostel.surplus.repository.ClaimRepository;
import com.hostel.surplus.repository.DayScholarRepository;
import com.hostel.surplus.repository.SurplusLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurplusService {

    private final SurplusLogRepository surplusRepo;
    private final DayScholarRepository dayScholarRepo;
    private final ClaimRepository claimRepo;

    // ---------- SURPLUS LOG ----------

    public SurplusLogDTO logSurplus(SurplusLogDTO dto) {
        SurplusLog log = SurplusLog.builder()
                .mealId(dto.getMealId())
                .mealType(dto.getMealType())
                .surplusDate(LocalDate.now())
                .preparedQty(dto.getPreparedQty())
                .servedQty(dto.getServedQty())
                .surplusQty(dto.getSurplusQty())
                .claimWindowEnd(LocalDateTime.now().plusMinutes(20))
                .disposition("DAY_SCHOLAR")
                .loggedAt(LocalDateTime.now())
                .build();
        return toDTO(surplusRepo.save(log));
    }

    public List<SurplusLogDTO> today() {
        return surplusRepo.findBySurplusDate(LocalDate.now())
                .stream().map(this::toDTO).toList();
    }

    public List<SurplusLogDTO> ngoQueue() {
        return surplusRepo.findByDisposition("NGO")
                .stream().map(this::toDTO).toList();
    }

    // ---------- DAY SCHOLAR ----------

    public DayScholarDTO registerDayScholar(DayScholarDTO dto) {
        if (dayScholarRepo.existsByCollegeId(dto.getCollegeId())) {
            throw new RuntimeException("College ID already registered");
        }
        DayScholar ds = DayScholar.builder()
                .name(dto.getName())
                .collegeId(dto.getCollegeId())
                .phone(dto.getPhone())
                .claimCount(0)
                .createdAt(LocalDateTime.now())
                .build();
        DayScholar saved = dayScholarRepo.save(ds);

        DayScholarDTO out = new DayScholarDTO();
        out.setId(saved.getId());
        out.setName(saved.getName());
        out.setCollegeId(saved.getCollegeId());
        out.setPhone(saved.getPhone());
        out.setClaimCount(saved.getClaimCount());
        return out;
    }

    public DayScholarDTO getDayScholarByCollegeId(String collegeId) {
        DayScholar ds = dayScholarRepo.findByCollegeId(collegeId)
                .orElseThrow(() -> new RuntimeException("Day scholar not found"));
        DayScholarDTO dto = new DayScholarDTO();
        dto.setId(ds.getId());
        dto.setName(ds.getName());
        dto.setCollegeId(ds.getCollegeId());
        dto.setPhone(ds.getPhone());
        dto.setClaimCount(ds.getClaimCount());
        return dto;
    }

    // ---------- CLAIM ----------

    @Transactional
    public SurplusLogDTO claim(Long surplusLogId, Long dayScholarId) {
        SurplusLog log = surplusRepo.findById(surplusLogId)
                .orElseThrow(() -> new RuntimeException("Surplus log not found"));

        if (log.getSurplusQty() <= 0) {
            throw new RuntimeException("No surplus available");
        }

        if (log.getClaimWindowEnd() != null &&
                LocalDateTime.now().isAfter(log.getClaimWindowEnd())) {
            throw new RuntimeException("Claim window closed");
        }

        if (claimRepo.findBySurplusLogId(surplusLogId).isPresent()) {
            throw new RuntimeException("Surplus already claimed");
        }

        DayScholar ds = dayScholarRepo.findById(dayScholarId)
                .orElseThrow(() -> new RuntimeException("Day scholar not found"));

        Claim claim = Claim.builder()
                .surplusLogId(surplusLogId)
                .dayScholarId(dayScholarId)
                .claimedAt(LocalDateTime.now())
                .pickedUp(false)
                .build();
        claimRepo.save(claim);

        log.setClaimedBy(dayScholarId);
        log.setDisposition("DAY_SCHOLAR");
        surplusRepo.save(log);

        ds.setClaimCount(ds.getClaimCount() + 1);
        dayScholarRepo.save(ds);

        return toDTO(log);
    }

    @Transactional
    public SurplusLogDTO markForNgo(Long surplusLogId) {
        SurplusLog log = surplusRepo.findById(surplusLogId)
                .orElseThrow(() -> new RuntimeException("Surplus log not found"));
        log.setDisposition("NGO");
        return toDTO(surplusRepo.save(log));
    }

    // ---------- MAPPER ----------

    private SurplusLogDTO toDTO(SurplusLog log) {
        SurplusLogDTO dto = new SurplusLogDTO();
        dto.setId(log.getId());
        dto.setMealId(log.getMealId());
        dto.setMealType(log.getMealType());
        dto.setPreparedQty(log.getPreparedQty());
        dto.setServedQty(log.getServedQty());
        dto.setSurplusQty(log.getSurplusQty());
        dto.setDisposition(log.getDisposition());
        dto.setClaimedBy(log.getClaimedBy());
        return dto;
    }
}