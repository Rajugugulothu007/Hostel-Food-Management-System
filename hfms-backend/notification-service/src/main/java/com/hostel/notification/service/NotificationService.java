package com.hostel.notification.service;

import com.hostel.notification.dto.NotificationDTO;
import com.hostel.notification.dto.NotificationRequest;
import com.hostel.notification.entity.FcmToken;
import com.hostel.notification.entity.Notification;
import com.hostel.notification.repository.FcmTokenRepository;
import com.hostel.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notifRepo;
    private final FcmTokenRepository tokenRepo;
    private final FcmService fcmService;

    /**
     * Send a notification to specific students OR broadcast to all.
     * Each send is logged in the DB.
     */
    public int send(NotificationRequest req) {
        List<FcmToken> targets;

        if (req.getRecipientIds() == null || req.getRecipientIds().isEmpty()) {
            // Broadcast to everyone with a registered device
            targets = tokenRepo.findAll();
        } else {
            targets = req.getRecipientIds().stream()
                    .map(tokenRepo::findByStudentId)
                    .filter(java.util.Optional::isPresent)
                    .map(java.util.Optional::get)
                    .toList();
        }

        int sent = 0;
        for (FcmToken t : targets) {
            try {
                boolean ok = fcmService.send(t.getToken(), req.getTitle(), req.getBody());

                Notification log = Notification.builder()
                        .recipientId(t.getStudentId())
                        .type(req.getType())
                        .title(req.getTitle())
                        .body(req.getBody())
                        .channel("FCM")
                        .status(ok ? "SENT" : "FAILED")
                        .sentAt(LocalDateTime.now())
                        .build();
                notifRepo.save(log);

                if (ok) sent++;
            } catch (Exception e) {
                log.warn("Send failed for student {}: {}", t.getStudentId(), e.getMessage());
                notifRepo.save(Notification.builder()
                        .recipientId(t.getStudentId())
                        .type(req.getType())
                        .title(req.getTitle())
                        .body(req.getBody())
                        .channel("FCM")
                        .status("FAILED")
                        .errorMessage(e.getMessage())
                        .sentAt(LocalDateTime.now())
                        .build());
            }
        }

        log.info("Notification '{}' sent to {}/{} recipients", req.getType(), sent, targets.size());
        return sent;
    }

    /**
     * Register or update an FCM device token for a student.
     */
    public void registerToken(Long studentId, String token, String deviceInfo) {
        FcmToken existing = tokenRepo.findByStudentId(studentId).orElse(null);
        if (existing != null) {
            existing.setToken(token);
            existing.setDeviceInfo(deviceInfo);
            existing.setUpdatedAt(LocalDateTime.now());
            tokenRepo.save(existing);
        } else {
            tokenRepo.save(FcmToken.builder()
                    .studentId(studentId)
                    .token(token)
                    .deviceInfo(deviceInfo)
                    .updatedAt(LocalDateTime.now())
                    .build());
        }
    }

    public List<NotificationDTO> historyForStudent(Long studentId) {
        return notifRepo.findByRecipientId(studentId).stream().map(this::toDTO).toList();
    }

    public List<NotificationDTO> all() {
        return notifRepo.findAll().stream().map(this::toDTO).toList();
    }

    private NotificationDTO toDTO(Notification n) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(n.getId());
        dto.setRecipientId(n.getRecipientId());
        dto.setType(n.getType());
        dto.setTitle(n.getTitle());
        dto.setBody(n.getBody());
        dto.setChannel(n.getChannel());
        dto.setStatus(n.getStatus());
        dto.setSentAt(n.getSentAt());
        return dto;
    }
}