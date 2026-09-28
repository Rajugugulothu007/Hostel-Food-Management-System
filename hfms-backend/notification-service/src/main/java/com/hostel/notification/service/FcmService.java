package com.hostel.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FcmService {

    /**
     * MVP: Simulated FCM send.
     * Logs to console and returns true.
     *
     * TO INTEGRATE REAL FIREBASE:
     * 1. Add firebase-admin dependency to pom.xml
     * 2. Download service account JSON from Firebase Console
     * 3. Initialize FirebaseApp in a @PostConstruct
     * 4. Replace the log line with:
     *    FirebaseMessaging.getInstance().send(Message.builder()...build());
     */
    public boolean send(String token, String title, String body) {
        if (token == null || token.isBlank()) {
            log.warn("FCM send skipped: empty token");
            return false;
        }

        // SIMULATED SEND — real Firebase would happen here
        log.info("[FCM-SIMULATED] → token={} | title={} | body={}",
                token.substring(0, Math.min(20, token.length())) + "...",
                title, body);

        return true;
    }
}