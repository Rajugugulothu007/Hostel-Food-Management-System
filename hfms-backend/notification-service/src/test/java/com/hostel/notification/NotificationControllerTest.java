package com.hostel.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.notification.controller.NotificationController;
import com.hostel.notification.dto.NotificationRequest;
import com.hostel.notification.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificationControllerTest {

    @Autowired private MockMvc mockMvc;
    @MockBean private NotificationService service;
    @Autowired private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void send_returnsCount() throws Exception {
        NotificationRequest req = new NotificationRequest();
        req.setTitle("Hi");
        req.setBody("Test");
        req.setType("VOTE_OPEN");

        when(service.send(any(NotificationRequest.class))).thenReturn(5);

        mockMvc.perform(post("/api/notifications/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sent").value(5))
                .andExpect(jsonPath("$.type").value("VOTE_OPEN"));
    }

    @Test
    @WithMockUser(username = "arjun", roles = "STUDENT")
    void registerToken_returnsStatus() throws Exception {
        String json = "{\"studentId\":1,\"token\":\"abc\",\"deviceInfo\":\"Pixel\"}";

        mockMvc.perform(post("/api/notifications/token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("registered"));
    }
}