package com.hostel.voting;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hostel.voting.controller.VoteController;
import com.hostel.voting.dto.VoteRequest;
import com.hostel.voting.dto.VoteResponse;
import com.hostel.voting.service.VoteService;      // ← must be here
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VoteController.class)
@AutoConfigureMockMvc(addFilters = false)
class VoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VoteService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "arjun", roles = "STUDENT")
    void castVote_returnsCreated() throws Exception {
        VoteRequest req = new VoteRequest();
        req.setMealId("MEAL001");
        req.setMealType("BREAKFAST");

        when(service.castVote(any(), any(VoteRequest.class)))
                .thenReturn(new VoteResponse("CREATED", "MEAL001", "BREAKFAST", "Vote cast successfully"));

        mockMvc.perform(post("/api/votes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CREATED"))
                .andExpect(jsonPath("$.mealId").value("MEAL001"));
    }

    @Test
    void getLiveCount_returnsCount() throws Exception {
        when(service.liveCount("MEAL001")).thenReturn(42L);

        mockMvc.perform(get("/api/votes/count/MEAL001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mealId").value("MEAL001"))
                .andExpect(jsonPath("$.count").value(42));
    }
}