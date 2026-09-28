package com.hostel.notification;

import com.hostel.notification.dto.NotificationRequest;
import com.hostel.notification.entity.FcmToken;
import com.hostel.notification.entity.Notification;
import com.hostel.notification.repository.FcmTokenRepository;
import com.hostel.notification.repository.NotificationRepository;
import com.hostel.notification.service.FcmService;
import com.hostel.notification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private NotificationRepository notifRepo;
    @Mock private FcmTokenRepository tokenRepo;
    @Mock private FcmService fcmService;

    private NotificationService service;

    @BeforeEach
    void setUp() {
        service = new NotificationService(notifRepo, tokenRepo, fcmService);
    }

    @Test
    void send_broadcast_toAllTokens() {
        when(tokenRepo.findAll()).thenReturn(List.of(
                FcmToken.builder().studentId(1L).token("tok1").build(),
                FcmToken.builder().studentId(2L).token("tok2").build()
        ));
        when(fcmService.send(any(), any(), any())).thenReturn(true);
        when(notifRepo.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        NotificationRequest req = new NotificationRequest();
        req.setTitle("Hi");
        req.setBody("Test");
        req.setType("VOTE_OPEN");

        int sent = service.send(req);

        assertEquals(2, sent);
        verify(notifRepo, times(2)).save(any(Notification.class));
    }

    @Test
    void send_targeted_onlyToRecipients() {
        when(tokenRepo.findByStudentId(1L)).thenReturn(Optional.of(
                FcmToken.builder().studentId(1L).token("tok1").build()));
        when(fcmService.send(any(), any(), any())).thenReturn(true);
        when(notifRepo.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        NotificationRequest req = new NotificationRequest();
        req.setTitle("Hi");
        req.setBody("Test");
        req.setType("VOTE_REMINDER");
        req.setRecipientIds(List.of(1L));

        int sent = service.send(req);

        assertEquals(1, sent);
    }

    @Test
    void send_whenFails_logsFailed() {
        when(tokenRepo.findAll()).thenReturn(List.of(
                FcmToken.builder().studentId(1L).token("tok1").build()));
        when(fcmService.send(any(), any(), any())).thenReturn(false);
        when(notifRepo.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

        NotificationRequest req = new NotificationRequest();
        req.setTitle("Hi");
        req.setBody("Test");
        req.setType("VOTE_OPEN");

        int sent = service.send(req);

        assertEquals(0, sent);
        verify(notifRepo).save(argThat(n -> "FAILED".equals(n.getStatus())));
    }

    @Test
    void registerToken_new_createsToken() {
        when(tokenRepo.findByStudentId(100L)).thenReturn(Optional.empty());
        when(tokenRepo.save(any(FcmToken.class))).thenAnswer(inv -> inv.getArgument(0));

        service.registerToken(100L, "newTok", "Pixel 6");

        verify(tokenRepo).save(any(FcmToken.class));
    }

    @Test
    void registerToken_existing_updates() {
        FcmToken existing = FcmToken.builder().id(1L).studentId(100L).token("old").build();
        when(tokenRepo.findByStudentId(100L)).thenReturn(Optional.of(existing));
        when(tokenRepo.save(any(FcmToken.class))).thenAnswer(inv -> inv.getArgument(0));

        service.registerToken(100L, "newTok", "Pixel 6");

        assertEquals("newTok", existing.getToken());
    }
}