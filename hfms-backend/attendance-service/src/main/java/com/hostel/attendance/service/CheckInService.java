package com.hostel.attendance.service;

import com.hostel.attendance.dto.AttendanceSummaryDTO;
import com.hostel.attendance.dto.CheckInDTO;
import com.hostel.attendance.dto.CheckInRequest;
import com.hostel.attendance.entity.CheckIn;
import com.hostel.attendance.repository.CheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository repo;

    @Transactional
    public CheckInDTO checkIn(CheckInRequest req) {
        LocalDate today = LocalDate.now();

        // Already checked in for this meal today → reject
        if (repo.findByStudentIdAndMealIdAndCheckInDate(
                req.getStudentId(), req.getMealId(), today).isPresent()) {
            throw new RuntimeException("Already checked in for this meal today");
        }

        CheckIn checkIn = CheckIn.builder()
                .studentId(req.getStudentId())
                .mealId(req.getMealId())
                .mealType(req.getMealType())
                .checkInDate(today)
                .checkInTime(LocalDateTime.now())
                .counterId(req.getCounterId())
                .build();

        return toDTO(repo.save(checkIn));
    }

    public List<CheckInDTO> today() {
        return repo.findByCheckInDate(LocalDate.now())
                .stream().map(this::toDTO).toList();
    }

    public List<CheckInDTO> forStudent(Long studentId) {
        return repo.findByStudentId(studentId)
                .stream().map(this::toDTO).toList();
    }

    public long headcount(String mealId) {
        return repo.countByMealIdAndCheckInDate(mealId, LocalDate.now());
    }

    public List<AttendanceSummaryDTO> todaySummary() {
        LocalDate today = LocalDate.now();
        List<AttendanceSummaryDTO> summary = new ArrayList<>();

        for (String mealType : List.of("BREAKFAST", "LUNCH", "DINNER")) {
            long count = repo.findByMealTypeAndCheckInDate(mealType, today).size();
            summary.add(new AttendanceSummaryDTO(mealType, count));
        }
        return summary;
    }

    private CheckInDTO toDTO(CheckIn c) {
        CheckInDTO dto = new CheckInDTO();
        dto.setId(c.getId());
        dto.setStudentId(c.getStudentId());
        dto.setMealId(c.getMealId());
        dto.setMealType(c.getMealType());
        dto.setCheckInDate(c.getCheckInDate());
        dto.setCheckInTime(c.getCheckInTime());
        dto.setCounterId(c.getCounterId());
        return dto;
    }
    public List<CheckInDTO> myToday(Long studentId) {
        return repo.findByStudentId(studentId)
                .stream()
                .filter(c -> c.getCheckInDate().equals(java.time.LocalDate.now()))
                .map(this::toDTO)
                .toList();
    }
}