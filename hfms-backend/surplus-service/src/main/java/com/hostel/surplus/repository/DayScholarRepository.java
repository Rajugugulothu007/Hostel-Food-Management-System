package com.hostel.surplus.repository;

import com.hostel.surplus.entity.DayScholar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DayScholarRepository extends JpaRepository<DayScholar, Long> {

    Optional<DayScholar> findByCollegeId(String collegeId);

    boolean existsByCollegeId(String collegeId);
}