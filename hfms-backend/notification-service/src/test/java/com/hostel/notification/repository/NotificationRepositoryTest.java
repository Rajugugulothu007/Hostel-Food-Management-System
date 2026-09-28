package com.hostel.notification.repository;

import com.hostel.notification.entity.Notification;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository repo;

    private Notification sample(Long recipient, String type) {
        return Notification.builder()
                .recipientId(recipient)
                .type(type)
                .title("Test")
                .body("Test body")
                .channel("FCM")
                .status("SENT")
                .sentAt(LocalDateTime.now())
                .build();
    }

    @Test
    void save_persists() {
        Notification saved = repo.save(sample(100L, "VOTE_OPEN"));
        assertThat(saved.getId()).isNotNull();
    }

    @Test
    void findByRecipientId_returnsHistory() {
        repo.save(sample(100L, "VOTE_OPEN"));
        repo.save(sample(100L, "MEAL_READY"));
        repo.save(sample(101L, "VOTE_OPEN"));

        assertThat(repo.findByRecipientId(100L)).hasSize(2);
    }

    @Test
    void findByType_returnsMatching() {
        repo.save(sample(100L, "VOTE_REMINDER"));
        repo.save(sample(101L, "VOTE_OPEN"));
        repo.save(sample(102L, "VOTE_REMINDER"));

        assertThat(repo.findByType("VOTE_REMINDER")).hasSize(2);
    }
}