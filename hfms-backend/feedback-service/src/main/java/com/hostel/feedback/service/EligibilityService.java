package com.hostel.feedback.service;

import com.hostel.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EligibilityService {

    private final FeedbackRepository feedbackRepo;
    private final RestTemplate restTemplate;

    @Value("${services.voting-url}")
    private String votingUrl;

    @Value("${services.attendance-url}")
    private String attendanceUrl;

    /**
     * Returns list of mealIds the student is eligible to rate:
     * - They voted for it today (voting-service)
     * - They checked in for it today (attendance-service)
     * - They haven't already submitted feedback for it today
     */
    public List<Map<String, String>> eligibleItems(Long studentId, String authHeader) {
        Set<String> voted = getVotedMealIds(authHeader);
        Set<String> ate = getAteMealIds(authHeader);

        // Intersection: voted AND ate
        Set<String> eligible = voted.stream()
                .filter(ate::contains)
                .collect(Collectors.toSet());

        // Remove already-rated today
        LocalDate today = LocalDate.now();
        List<String> alreadyRated = feedbackRepo
                .findByStudentId(studentId)
                .stream()
                .filter(f -> f.getFeedbackDate().equals(today))
                .map(f -> f.getMealId())
                .toList();

        eligible.removeAll(alreadyRated);

        List<Map<String, String>> result = new ArrayList<>();
        for (String mealId : eligible) {
            result.add(Map.of("mealId", mealId));
        }
        return result;
    }

    private Set<String> getVotedMealIds(String authHeader) {
        try {
            String url = votingUrl + "/api/votes/my";
            var res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(authHeaders(authHeader)),
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return res.getBody().stream()
                    .map(m -> (String) m.get("mealId"))
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            log.warn("Failed to fetch votes: {}", e.getMessage());
            return Set.of();
        }
    }

    private Set<String> getAteMealIds(String authHeader) {
        try {
            String url = attendanceUrl + "/api/attendance/my/today";
            var res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(authHeaders(authHeader)),
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {}
            );
            return res.getBody().stream()
                    .map(m -> (String) m.get("mealId"))
                    .collect(Collectors.toSet());
        } catch (Exception e) {
            log.warn("Failed to fetch attendance: {}", e.getMessage());
            return Set.of();
        }
    }

    private HttpHeaders authHeaders(String authHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        return headers;
    }
}