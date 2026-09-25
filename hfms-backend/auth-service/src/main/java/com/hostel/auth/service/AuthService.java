package com.hostel.auth.service;

import com.hostel.auth.dto.*;
import com.hostel.auth.entity.UserCredential;
import com.hostel.auth.repository.UserCredentialRepository;
import com.hostel.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserCredentialRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new LoginResponse(token, user.getRole(), user.getUsername());
    }
}