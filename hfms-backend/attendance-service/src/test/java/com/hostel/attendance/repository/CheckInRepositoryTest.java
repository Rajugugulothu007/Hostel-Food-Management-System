package com.hostel.attendance.repository;

import com.hostel.attendance.entity.CheckIn;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CheckInRepositoryTest {

    @Autowired
    private CheckInRepository repo;

    private CheckIn sample(Long studentId, String mealId, String mealType) {
        return CheckIn.builder()
                .studentId(studentId)
                .mealId(mealId)
                .mealType(mealType)
                .checkInDate(LocalDate.now())
                .checkInTime(LocalDateTime.now())
                .build();
    }

    @Test
    void save_persistsCheckIn() {
        CheckIn saved = repo.save(sample(100L, "MEAL001", "BREAKFAST"));
        assertThat(saved.getId()).isNotNull();
    }

    @Test
    void countByMealIdAndCheckInDate_counts() {
        repo.save(sample(100L, "MEAL001", "BREAKFAST"));
        repo.save(sample(101L, "MEAL001", "BREAKFAST"));
        repo.save(sample(102L, "MEAL002", "BREAKFAST"));

        long count = repo.countByMealIdAndCheckInDate("MEAL001", LocalDate.now());

        assertThat(count).isEqualTo(2);
    }

    @Test
    void findByStudentIdAndMealIdAndCheckInDate_findsExisting() {
        repo.save(sample(100L, "MEAL001", "BREAKFAST"));

        assertThat(repo.findByStudentIdAndMealIdAndCheckInDate(
                100L, "MEAL001", LocalDate.now())).isPresent();
    }

    @Test
    void findByMealTypeAndCheckInDate_returnsMatching() {
        repo.save(sample(100L, "MEAL001", "BREAKFAST"));
        repo.save(sample(101L, "MEAL002", "BREAKFAST"));
        repo.save(sample(102L, "MEAL011", "LUNCH"));

        var breakfast = repo.findByMealTypeAndCheckInDate("BREAKFAST", LocalDate.now());

        assertThat(breakfast).hasSize(2);
    }
}