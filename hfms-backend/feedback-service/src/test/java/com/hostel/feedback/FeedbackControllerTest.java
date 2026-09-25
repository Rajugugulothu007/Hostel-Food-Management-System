package com.hostel.feedback;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.feedback.controller.FeedbackController;
import com.hostel.feedback.dto.FeedbackDTO;
import com.hostel.feedback.service.FeedbackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FeedbackController.class)
@AutoConfigureMockMvc(addFilters = false)
class FeedbackControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FeedbackService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "arjun", roles = "STUDENT")
    void submit_returnsFeedback() throws Exception {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setMealId("MEAL001");
        dto.setMealType("BREAKFAST");
        dto.setRating(4);
        dto.setComment("Good");

        FeedbackDTO saved = new FeedbackDTO();
        saved.setId(1L);
        saved.setMealId("MEAL001");
        saved.setRating(4);
        saved.setComment("Good");

        when(service.submit(any(), any(FeedbackDTO.class))).thenReturn(saved);

        mockMvc.perform(post("/api/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mealId").value("MEAL001"))
                .andExpect(jsonPath("$.rating").value(4));
    }

    @Test
    void forMeal_returnsList() throws Exception {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(1L);
        dto.setMealId("MEAL001");
        dto.setRating(4);

        when(service.forMeal("MEAL001")).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/feedback/item/MEAL001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(username = "arjun", roles = "STUDENT")
    void myFeedback_returnsList() throws Exception {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(1L);
        dto.setMealId("MEAL001");
        dto.setRating(5);

        when(service.myFeedback(any())).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/feedback/my"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void lowRated_returnsList() throws Exception {
        when(service.lowRated()).thenReturn(List.of());

        mockMvc.perform(get("/api/feedback/low-rated"))
                .andExpect(status().isOk());
    }
}