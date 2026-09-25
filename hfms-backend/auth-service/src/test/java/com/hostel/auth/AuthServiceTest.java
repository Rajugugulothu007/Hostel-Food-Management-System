package com.hostel.auth;

import com.hostel.auth.dto.LoginRequest;
import com.hostel.auth.dto.LoginResponse;
import com.hostel.auth.dto.SignupRequest;
import com.hostel.auth.entity.UserCredential;
import com.hostel.auth.repository.UserCredentialRepository;
import com.hostel.auth.service.AuthService;
import com.hostel.auth.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserCredentialRepository repo;

    @Mock
    private JwtUtil jwtUtil;

    private PasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        authService = new AuthService(repo, passwordEncoder, jwtUtil);
    }

    // ---------- SIGNUP TESTS ----------

    @Test
    void signup_success_savesUser() {
        SignupRequest req = new SignupRequest();
        req.setUsername("arjun");
        req.setPassword("pass123");
        req.setRole("STUDENT");

        when(repo.existsByUsername("arjun")).thenReturn(false);
        when(repo.save(any(UserCredential.class))).thenReturn(new UserCredential());

        assertDoesNotThrow(() -> authService.signup(req));

        verify(repo, times(1)).existsByUsername("arjun");
        verify(repo, times(1)).save(any(UserCredential.class));
    }

    @Test
    void signup_defaultsRoleToStudent() {
        SignupRequest req = new SignupRequest();
        req.setUsername("newuser");
        req.setPassword("pass123");
        // role not set → should default to STUDENT

        when(repo.existsByUsername("newuser")).thenReturn(false);
        when(repo.save(any(UserCredential.class))).thenAnswer(inv -> {
            UserCredential u = inv.getArgument(0);
            assertEquals("STUDENT", u.getRole());
            return u;
        });

        authService.signup(req);

        verify(repo).save(any(UserCredential.class));
    }

    @Test
    void signup_duplicateUsername_throws() {
        SignupRequest req = new SignupRequest();
        req.setUsername("arjun");
        req.setPassword("pass123");

        when(repo.existsByUsername("arjun")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.signup(req));

        assertEquals("Username already exists", ex.getMessage());
        verify(repo, never()).save(any());
    }

    // ---------- LOGIN TESTS ----------

    @Test
    void login_success_returnsTokenAndRole() {
        LoginRequest req = new LoginRequest();
        req.setUsername("arjun");
        req.setPassword("pass123");

        UserCredential user = UserCredential.builder()
                .username("arjun")
                .passwordHash(passwordEncoder.encode("pass123"))
                .role("STUDENT")
                .build();

        when(repo.findByUsername("arjun")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("arjun", "STUDENT")).thenReturn("mock.jwt.token");

        LoginResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("mock.jwt.token", res.getToken());
        assertEquals("STUDENT", res.getRole());
        assertEquals("arjun", res.getUsername());
    }

    @Test
    void login_invalidPassword_throws() {
        LoginRequest req = new LoginRequest();
        req.setUsername("arjun");
        req.setPassword("wrongpass");

        UserCredential user = UserCredential.builder()
                .username("arjun")
                .passwordHash(passwordEncoder.encode("pass123"))
                .role("STUDENT")
                .build();

        when(repo.findByUsername("arjun")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertEquals("Invalid credentials", ex.getMessage());
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void login_userNotFound_throws() {
        LoginRequest req = new LoginRequest();
        req.setUsername("unknown");
        req.setPassword("pass123");

        when(repo.findByUsername("unknown")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login(req));

        assertEquals("Invalid credentials", ex.getMessage());
    }
}