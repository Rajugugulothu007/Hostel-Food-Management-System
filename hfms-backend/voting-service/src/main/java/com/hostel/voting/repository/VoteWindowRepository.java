package com.hostel.voting.repository;

import com.hostel.voting.entity.VoteWindow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface VoteWindowRepository extends JpaRepository<VoteWindow, Long> {

    Optional<VoteWindow> findByHostelIdAndMealTypeAndWindowDate(
            Long hostelId, String mealType, LocalDate date);
}