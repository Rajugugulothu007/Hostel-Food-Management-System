package com.hostel.voting.scheduler;

import com.hostel.voting.entity.VoteWindow;
import com.hostel.voting.repository.VoteWindowRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DailyWindowScheduler {

    private final VoteWindowRepository repo;

    /**
     * Runs once at service startup — creates today's windows if missing.
     */
    @PostConstruct
    public void init() {
        log.info("Startup: ensuring today's vote windows exist");
        createDailyWindows();
    }

    /**
     * Runs every day at midnight — creates fresh windows for the new day.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void createDailyWindows() {
        LocalDate today = LocalDate.now();
        log.info("Ensuring vote windows for {}", today);

        createIfMissing("BREAKFAST", today);
        createIfMissing("LUNCH", today);
        createIfMissing("DINNER", today);
    }

    private void createIfMissing(String mealType, LocalDate date) {
        if (repo.findByHostelIdAndMealTypeAndWindowDate(1L, mealType, date).isPresent()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime opensAt = now.minusHours(1);
        LocalDateTime locksAt = date.atTime(23, 59);   // demo: open all day

        repo.save(VoteWindow.builder()
                .hostelId(1L)
                .mealType(mealType)
                .windowDate(date)
                .opensAt(opensAt)
                .locksAt(locksAt)
                .status("OPEN")
                .build());

        log.info("Created {} window for {}", mealType, date);
    }
}