package com.hostel.feedback.repository;

import com.hostel.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByMealId(String mealId);

    List<Feedback> findByStudentId(Long studentId);

    Optional<Feedback> findByStudentIdAndMealIdAndFeedbackDate(
            Long studentId, String mealId, LocalDate feedbackDate);

    @Query("SELECT f.mealId, AVG(f.rating) FROM Feedback f " +
            "GROUP BY f.mealId HAVING AVG(f.rating) < 3.0")
    List<Object[]> findLowRatedMeals();

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.mealId = :mealId")
    Double findAverageRatingForMeal(String mealId);
}