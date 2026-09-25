package com.hostel.voting.repository;

import com.hostel.voting.entity.VoteWindow;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class VoteWindowRepositoryTest {

    @Autowired
    private VoteWindowRepository repo;

    private VoteWindow sampleWindow(String mealType) {
        return VoteWindow.builder()
                .hostelId(1L)
                .mealType(mealType)
                .windowDate(LocalDate.now())
                .opensAt(LocalDateTime.now().minusHours(1))
                .locksAt(LocalDateTime.now().plusHours(4))
                .status("OPEN")
                .build();
    }

    @Test
    void save_persistsWindow() {
        VoteWindow saved = repo.save(sampleWindow("BREAKFAST"));
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getMealType()).isEqualTo("BREAKFAST");
    }

    @Test
    void findByHostelIdAndMealTypeAndWindowDate_returnsWindow() {
        repo.save(sampleWindow("BREAKFAST"));

        Optional<VoteWindow> found = repo.findByHostelIdAndMealTypeAndWindowDate(
                1L, "BREAKFAST", LocalDate.now());

        assertThat(found).isPresent();
    }

    @Test
    void findByHostelIdAndMealTypeAndWindowDate_notFound_returnsEmpty() {
        Optional<VoteWindow> found = repo.findByHostelIdAndMealTypeAndWindowDate(
                1L, "BREAKFAST", LocalDate.now());

        assertThat(found).isEmpty();
    }

    @Test
    void multipleMealTypes_canCoexistForSameDay() {
        repo.save(sampleWindow("BREAKFAST"));
        repo.save(sampleWindow("LUNCH"));
        repo.save(sampleWindow("DINNER"));

        assertThat(repo.findByHostelIdAndMealTypeAndWindowDate(1L, "BREAKFAST", LocalDate.now())).isPresent();
        assertThat(repo.findByHostelIdAndMealTypeAndWindowDate(1L, "LUNCH", LocalDate.now())).isPresent();
        assertThat(repo.findByHostelIdAndMealTypeAndWindowDate(1L, "DINNER", LocalDate.now())).isPresent();
    }
}