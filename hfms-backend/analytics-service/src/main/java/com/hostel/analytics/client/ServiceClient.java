package com.hostel.analytics.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.voting-url}")
    private String votingUrl;

    @Value("${services.attendance-url}")
    private String attendanceUrl;

    @Value("${services.surplus-url}")
    private String surplusUrl;

    @Value("${services.feedback-url}")
    private String feedbackUrl;

    private HttpEntity<Void> authEntity(String authHeader) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        return new HttpEntity<>(headers);
    }

    public Map<String, Object> getVoteCount(String mealId, String authHeader) {
        String url = votingUrl + "/api/votes/count/" + mealId;
        ResponseEntity<Map> resp = restTemplate.exchange(
                url, HttpMethod.GET, authEntity(authHeader), Map.class);
        return resp.getBody();
    }

    public Map<String, Object> getCheckInCount(String mealId, String authHeader) {
        String url = attendanceUrl + "/api/attendance/meal/" + mealId + "/count";
        ResponseEntity<Map> resp = restTemplate.exchange(
                url, HttpMethod.GET, authEntity(authHeader), Map.class);
        return resp.getBody();
    }

    public List<Map<String, Object>> getTodaySurplus(String authHeader) {
        String url = surplusUrl + "/api/surplus/today";
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                url, HttpMethod.GET, authEntity(authHeader),
                new ParameterizedTypeReference<>() {});
        return resp.getBody();
    }

    public List<Map<String, Object>> getTodayFeedback(String mealId, String authHeader) {
        String url = feedbackUrl + "/api/feedback/item/" + mealId;
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                url, HttpMethod.GET, authEntity(authHeader),
                new ParameterizedTypeReference<>() {});
        return resp.getBody();
    }
}