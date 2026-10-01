package com.hostel.notification.scheduler;

import com.hostel.notification.dto.NotificationRequest;
import com.hostel.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final NotificationService service;
    private final Random random = new Random();

    // ══════════════════════════════════════════════════════════════
    // MESSAGE POOLS — pick a random one each time
    // ══════════════════════════════════════════════════════════════

    private static final List<String[]> VOTE_OPEN_POOL = List.of(
            new String[]{"🍽 Hungry?", "Vote and grab your meal before the window closes!"},
            new String[]{"Today's menu is LIVE 🍛", "Pick your plate — it takes 10 seconds."},
            new String[]{"What's cooking today? 🍴", "Cast your vote and let the kitchen know."},
            new String[]{"Your taste buds called 👅", "They want you to vote for today's meal."},
            new String[]{"Don't settle for 'whatever' 🍲", "Vote for what YOU want to eat today."},
            new String[]{"Menu unlocked 🔓", "Scroll, pick, vote. Your plate awaits."},
            new String[]{"Breakfast, lunch, or dinner? 🍽", "Vote now before the kitchen starts cooking."},
            new String[]{"Craving something? 🥘", "Tell us by voting — you've got 2 hours."}
    );

    private static final List<String[]> VOTE_REMINDER_POOL = List.of(
            new String[]{"⏰ Last call!", "Your plate is waiting — vote NOW before it's too late."},
            new String[]{"15 minutes left ⏳", "Don't miss out. Vote in one tap."},
            new String[]{"Still haven't voted? 😱", "The clock is ticking. Cast your vote now."},
            new String[]{"Hey! Vote or starve 😋", "Okay, not really. But hurry — 15 min left."},
            new String[]{"Almost closing! 🚨", "Last chance to have a say in today's meal."},
            new String[]{"Your vote expires soon ⌛", "Tap now — takes 5 seconds."},
            new String[]{"Snooze = lose 😴", "You'll miss your favourite meal if you don't vote."}
    );

    private static final List<String[]> VOTE_CLOSED_POOL = List.of(
            new String[]{"🔒 Voting closed", "Results are in! See you at the counter."},
            new String[]{"That's a wrap 🎬", "Kitchen has your order. Catch you at mealtime."},
            new String[]{"Done and dusted ✨", "Your vote is locked. Bon appétit coming soon!"},
            new String[]{"Counter's open! 🍴", "See you when the food's ready."}
    );

    private static final List<String[]> MEAL_READY_POOL = List.of(
            new String[]{"🍽 Meal is ready!", "Scan your QR at Counter 1 and grab your plate."},
            new String[]{"Hot food alert 🔥", "Your meal just came off the stove. Head over!"},
            new String[]{"Dinner's served 🥘", "It's time! Show your QR at the counter."},
            new String[]{"Your plate awaits 🍛", "Fresh from the kitchen — come grab it!"},
            new String[]{"Food is calling 📢", "Kitchen's ready. Bring your QR code."}
    );

    private static final List<String[]> ABSENT_REMINDER_POOL = List.of(
            new String[]{"Going home? 🏠", "Mark yourself absent so we don't waste food."},
            new String[]{"Not eating today? 🤔", "Let us know so the kitchen adjusts quantities."},
            new String[]{"Heads up! 📝", "If you won't be at the hostel, mark absent."}
    );

    // ══════════════════════════════════════════════════════════════
    // SCHEDULED JOBS
    // ══════════════════════════════════════════════════════════════

    /**
     * 8:30 AM — Lunch voting opens
     */
    @Scheduled(cron = "0 30 8 * * *")
    public void lunchVoteOpen() {
        log.info("Sending randomized lunch vote-open notification");
        broadcast("VOTE_OPEN", VOTE_OPEN_POOL);
    }

    /**
     * 10:15 AM — 15 min before lunch lock
     */
    @Scheduled(cron = "0 15 10 * * *")
    public void lunchVoteReminder() {
        log.info("Sending randomized lunch reminder");
        broadcast("VOTE_REMINDER", VOTE_REMINDER_POOL);
    }

    /**
     * 10:30 AM — Lunch voting closes
     */
    @Scheduled(cron = "0 30 10 * * *")
    public void lunchVoteClosed() {
        log.info("Sending randomized lunch closed notification");
        broadcast("VOTE_CLOSED", VOTE_CLOSED_POOL);
    }

    /**
     * 12:00 PM — Lunch is ready
     */
    @Scheduled(cron = "0 0 12 * * *")
    public void lunchReady() {
        log.info("Sending randomized lunch-ready notification");
        broadcast("MEAL_READY", MEAL_READY_POOL);
    }

    /**
     * 2:30 PM — Dinner voting opens
     */
    @Scheduled(cron = "0 30 14 * * *")
    public void dinnerVoteOpen() {
        log.info("Sending randomized dinner vote-open notification");
        broadcast("VOTE_OPEN", VOTE_OPEN_POOL);
    }

    /**
     * 4:15 PM — 15 min before dinner lock
     */
    @Scheduled(cron = "0 15 16 * * *")
    public void dinnerVoteReminder() {
        log.info("Sending randomized dinner reminder");
        broadcast("VOTE_REMINDER", VOTE_REMINDER_POOL);
    }

    /**
     * 4:30 PM — Dinner voting closes
     */
    @Scheduled(cron = "0 30 16 * * *")
    public void dinnerVoteClosed() {
        log.info("Sending randomized dinner closed notification");
        broadcast("VOTE_CLOSED", VOTE_CLOSED_POOL);
    }

    /**
     * 7:30 PM — Dinner is ready
     */
    @Scheduled(cron = "0 30 19 * * *")
    public void dinnerReady() {
        log.info("Sending randomized dinner-ready notification");
        broadcast("MEAL_READY", MEAL_READY_POOL);
    }

    /**
     * 8:00 PM — Breakfast voting opens (for next morning)
     */
    @Scheduled(cron = "0 0 20 * * *")
    public void breakfastVoteOpen() {
        log.info("Sending randomized breakfast vote-open notification");
        broadcast("VOTE_OPEN", VOTE_OPEN_POOL);
    }

    /**
     * 10:15 PM — 15 min before breakfast lock
     */
    @Scheduled(cron = "0 15 22 * * *")
    public void breakfastVoteReminder() {
        log.info("Sending randomized breakfast reminder");
        broadcast("VOTE_REMINDER", VOTE_REMINDER_POOL);
    }

    /**
     * 10:30 PM — Breakfast voting closes
     */
    @Scheduled(cron = "0 30 22 * * *")
    public void breakfastVoteClosed() {
        log.info("Sending randomized breakfast closed notification");
        broadcast("VOTE_CLOSED", VOTE_CLOSED_POOL);
    }

    /**
     * 7:00 AM — Breakfast is ready
     */
    @Scheduled(cron = "0 0 7 * * *")
    public void breakfastReady() {
        log.info("Sending randomized breakfast-ready notification");
        broadcast("MEAL_READY", MEAL_READY_POOL);
    }

    // ══════════════════════════════════════════════════════════════
    // HELPERS
    // ══════════════════════════════════════════════════════════════

    /**
     * Pick a random message from the pool and broadcast to all.
     */
    private void broadcast(String type, List<String[]> pool) {
        String[] picked = pool.get(random.nextInt(pool.size()));

        NotificationRequest req = new NotificationRequest();
        req.setType(type);
        req.setTitle(picked[0]);
        req.setBody(picked[1]);

        int sent = service.send(req);
        log.info("Broadcast '{}' → sent to {} recipients", type, sent);
    }
}