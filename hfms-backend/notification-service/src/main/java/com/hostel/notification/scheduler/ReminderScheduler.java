package com.hostel.notification.scheduler;

import com.hostel.notification.dto.NotificationRequest;
import com.hostel.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final NotificationService service;

    /**
     * Every day at 10:15 PM — 15 minutes before breakfast voting closes.
     * In MVP, broadcasts to everyone. Later: send only to students who haven't voted.
     */
    @Scheduled(cron = "0 15 22 * * *")
    public void breakfastVoteReminder() {
        log.info("Running breakfast vote reminder job");
        NotificationRequest req = new NotificationRequest();
        req.setType("VOTE_REMINDER");
        req.setTitle("⏰ Last call — breakfast vote");
        req.setBody("Only 15 minutes left to vote for tomorrow's breakfast. Vote now!");
        service.send(req);
    }

    /**
     * Every day at 8:30 AM — lunch voting opens.
     */
    @Scheduled(cron = "0 30 8 * * *")
    public void lunchVoteOpen() {
        log.info("Running lunch vote open job");
        NotificationRequest req = new NotificationRequest();
        req.setType("VOTE_OPEN");
        req.setTitle("🍽 Lunch voting is open");
        req.setBody("Vote for today's lunch before 10:30 AM.");
        service.send(req);
    }

    /**
     * Every day at 2:30 PM — dinner voting opens.
     */
    @Scheduled(cron = "0 30 14 * * *")
    public void dinnerVoteOpen() {
        log.info("Running dinner vote open job");
        NotificationRequest req = new NotificationRequest();
        req.setType("VOTE_OPEN");
        req.setTitle("🍽 Dinner voting is open");
        req.setBody("Vote for tonight's dinner before 4:30 PM.");
        service.send(req);
    }
}