package com.hostel.feedback.repository;

import com.hostel.feedback.entity.Feedback;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class FeedbackRepositoryTest {

    @Autowired
    private FeedbackRepository repo;

    private Feedback sampleFeedback(Long studentId, String mealId, int rating) {
        return Feedback.builder()
                .studentId(studentId)
                .mealId(mealId)
                .mealType("BREAKFAST")
                .feedbackDate(LocalDate.now())
                .rating(rating)
                .build();
    }

    @Test
    void save_persistsFeedback() {
        Feedback saved = repo.save(sampleFeedback(100L, "MEAL001", 4));

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRating()).isEqualTo(4);
    }

    @Test
    void findByMealId_returnsAllForMeal() {
        repo.save(sampleFeedback(100L, "MEAL001", 4));
        repo.save(sampleFeedback(101L, "MEAL001", 5));
        repo.save(sampleFeedback(102L, "MEAL002", 3));

        List<Feedback> result = repo.findByMealId("MEAL001");

        assertThat(result).hasSize(2);
    }

    @Test
    void findByStudentIdAndMealIdAndFeedbackDate_returnsFeedback() {
        repo.save(sampleFeedback(100L, "MEAL001", 4));

        Optional<Feedback> found = repo.findByStudentIdAndMealIdAndFeedbackDate(
                100L, "MEAL001", LocalDate.now());

        assertThat(found).isPresent();
        assertThat(found.get().getRating()).isEqualTo(4);
    }

    @Test
    void findAverageRatingForMeal_returnsAverage() {
        repo.save(sampleFeedback(100L, "MEAL001", 4));
        repo.save(sampleFeedback(101L, "MEAL001", 5));
        repo.save(sampleFeedback(102L, "MEAL001", 3));

        Double avg = repo.findAverageRatingForMeal("MEAL001");

        assertThat(avg).isEqualTo(4.0);
    }
}