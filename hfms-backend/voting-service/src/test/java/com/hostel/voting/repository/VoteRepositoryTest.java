package com.hostel.voting.repository;

import com.hostel.voting.entity.Vote;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class VoteRepositoryTest {

    @Autowired
    private VoteRepository repo;

    private Vote sampleVote(Long studentId, String mealId) {
        return Vote.builder()
                .studentId(studentId)
                .mealId(mealId)
                .voteDate(LocalDate.now())
                .votedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void save_persistsVote() {
        Vote saved = repo.save(sampleVote(100L, "MEAL001"));

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getStudentId()).isEqualTo(100L);
        assertThat(saved.getMealId()).isEqualTo("MEAL001");
    }

    @Test
    void findByStudentIdAndMealIdAndVoteDate_returnsVote() {
        repo.save(sampleVote(100L, "MEAL001"));

        Optional<Vote> found = repo.findByStudentIdAndMealIdAndVoteDate(
                100L, "MEAL001", LocalDate.now());

        assertThat(found).isPresent();
        assertThat(found.get().getMealId()).isEqualTo("MEAL001");
    }

    @Test
    void findByStudentIdAndMealIdAndVoteDate_notFound_returnsEmpty() {
        Optional<Vote> found = repo.findByStudentIdAndMealIdAndVoteDate(
                999L, "MEAL999", LocalDate.now());

        assertThat(found).isEmpty();
    }

    @Test
    void countByMealIdAndVoteDate_countsCorrectly() {
        repo.save(sampleVote(100L, "MEAL001"));
        repo.save(sampleVote(101L, "MEAL001"));
        repo.save(sampleVote(102L, "MEAL001"));
        repo.save(sampleVote(103L, "MEAL005")); // different meal

        long count = repo.countByMealIdAndVoteDate("MEAL001", LocalDate.now());

        assertThat(count).isEqualTo(3);
    }

    @Test
    void findByMealIdAndVoteDate_returnsAllMatchingVotes() {
        repo.save(sampleVote(100L, "MEAL001"));
        repo.save(sampleVote(101L, "MEAL001"));
        repo.save(sampleVote(102L, "MEAL005"));

        List<Vote> votes = repo.findByMealIdAndVoteDate("MEAL001", LocalDate.now());

        assertThat(votes).hasSize(2);
        assertThat(votes).extracting(Vote::getMealId).containsOnly("MEAL001");
    }
}