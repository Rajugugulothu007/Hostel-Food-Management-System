package com.hostel.auth.service;

import com.hostel.auth.dto.*;
import com.hostel.auth.entity.UserCredential;
import com.hostel.auth.repository.UserCredentialRepository;
import com.hostel.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserCredentialRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    @Value("${services.user-url}")
    private String userUrl;

    public void signup(SignupRequest req) {
        if (repo.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        UserCredential user = UserCredential.builder()
                .username(req.getUsername())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole() == null ? "STUDENT" : req.getRole())
                .createdAt(LocalDateTime.now())
                .build();
        repo.save(user);
    }

    public LoginResponse login(LoginRequest req) {
        UserCredential user = repo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ═══════════════════════════════════════════════════════════
        // If the user is a student, verify they're still active
        // in user-service before issuing a token
        // ═══════════════════════════════════════════════════════════
        if ("STUDENT".equals(user.getRole())) {
            checkStudentActive(user.getUsername());
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new LoginResponse(token, user.getRole(), user.getUsername());
    }

    private void checkStudentActive(String username) {
        try {
            String url = userUrl + "/api/students/by-username/" + username;
            ResponseEntity<Map> res = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Map.class);

            Map body = res.getBody();
            if (body != null && Boolean.FALSE.equals(body.get("active"))) {
                throw new RuntimeException(
                        "Your account has been deactivated. Please contact hostel admin.");
            }
        } catch (RuntimeException e) {
            throw e; // re-throw our own exception
        } catch (Exception e) {
            log.warn("Active check failed for {}: {}", username, e.getMessage());
            // Fail-open: if user-service is down, allow login
        }
    }
}