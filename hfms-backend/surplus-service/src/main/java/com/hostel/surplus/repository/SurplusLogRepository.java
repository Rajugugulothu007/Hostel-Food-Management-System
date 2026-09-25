package com.hostel.surplus.repository;

import com.hostel.surplus.entity.SurplusLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SurplusLogRepository extends JpaRepository<SurplusLog, Long> {

    List<SurplusLog> findBySurplusDate(LocalDate date);

    List<SurplusLog> findByDisposition(String disposition);
}