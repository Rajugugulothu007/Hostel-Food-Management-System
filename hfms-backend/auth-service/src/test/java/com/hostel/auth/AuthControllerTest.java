package com.hostel.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.auth.controller.AuthController;
import com.hostel.auth.dto.LoginRequest;
import com.hostel.auth.dto.LoginResponse;
import com.hostel.auth.dto.SignupRequest;
import com.hostel.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    // ---------- SIGNUP ----------

    @Test
    void signup_returns200WithMessage() throws Exception {
        SignupRequest req = new SignupRequest();
        req.setUsername("arjun");
        req.setPassword("pass123");
        req.setRole("STUDENT");

        doNothing().when(authService).signup(any(SignupRequest.class));

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    void signup_missingUsername_returns400() throws Exception {
        SignupRequest req = new SignupRequest();
        req.setPassword("pass123");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signup_missingPassword_returns400() throws Exception {
        SignupRequest req = new SignupRequest();
        req.setUsername("arjun");

        mockMvc.perform(post("/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    // ---------- LOGIN ----------

    @Test
    void login_returnsTokenRoleUsername() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setUsername("arjun");
        req.setPassword("pass123");

        when(authService.login(any(LoginRequest.class)))
                .thenReturn(new LoginResponse("mock.jwt.token", "STUDENT", "arjun"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.username").value("arjun"));
    }

    @Test
    void login_missingFields_returns400() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setUsername("arjun");
        // password missing

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}