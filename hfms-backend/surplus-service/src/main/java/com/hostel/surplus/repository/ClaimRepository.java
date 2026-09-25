package com.hostel.surplus.repository;

import com.hostel.surplus.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    Optional<Claim> findBySurplusLogId(Long surplusLogId);

    List<Claim> findByDayScholarId(Long dayScholarId);
}