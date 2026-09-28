package com.hostel.attendance.repository;

import com.hostel.attendance.entity.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {

    List<CheckIn> findByCheckInDate(LocalDate date);

    List<CheckIn> findByStudentId(Long studentId);

    Optional<CheckIn> findByStudentIdAndMealIdAndCheckInDate(
            Long studentId, String mealId, LocalDate date);

    long countByMealIdAndCheckInDate(String mealId, LocalDate date);

    List<CheckIn> findByMealTypeAndCheckInDate(String mealType, LocalDate date);
}