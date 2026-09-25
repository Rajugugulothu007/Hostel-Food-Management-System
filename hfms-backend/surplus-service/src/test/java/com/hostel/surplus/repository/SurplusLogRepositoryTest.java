package com.hostel.surplus.repository;

import com.hostel.surplus.entity.SurplusLog;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class SurplusLogRepositoryTest {

    @Autowired
    private SurplusLogRepository repo;

    private SurplusLog sample(String mealId, String disposition) {
        return SurplusLog.builder()
                .mealId(mealId)
                .mealType("BREAKFAST")
                .surplusDate(LocalDate.now())
                .surplusQty(5)
                .disposition(disposition)
                .build();
    }

    @Test
    void save_persistsLog() {
        SurplusLog saved = repo.save(sample("MEAL001", "DAY_SCHOLAR"));
        assertThat(saved.getId()).isNotNull();
    }

    @Test
    void findBySurplusDate_returnsTodayLogs() {
        repo.save(sample("MEAL001", "DAY_SCHOLAR"));
        repo.save(sample("MEAL002", "DAY_SCHOLAR"));

        List<SurplusLog> result = repo.findBySurplusDate(LocalDate.now());

        assertThat(result).hasSize(2);
    }

    @Test
    void findByDisposition_returnsFiltered() {
        repo.save(sample("MEAL001", "DAY_SCHOLAR"));
        repo.save(sample("MEAL002", "NGO"));
        repo.save(sample("MEAL003", "NGO"));

        List<SurplusLog> result = repo.findByDisposition("NGO");

        assertThat(result).hasSize(2);
    }
}