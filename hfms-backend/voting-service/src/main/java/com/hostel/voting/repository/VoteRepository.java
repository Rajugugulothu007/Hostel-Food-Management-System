package com.hostel.voting.repository;

import com.hostel.voting.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    Optional<Vote> findByStudentIdAndMealIdAndVoteDate(
            Long studentId, String mealId, LocalDate date);

    List<Vote> findByMealIdAndVoteDate(String mealId, LocalDate date);

    long countByMealIdAndVoteDate(String mealId, LocalDate date);
}