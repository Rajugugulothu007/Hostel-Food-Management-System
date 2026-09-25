package com.hostel.feedback;

import com.hostel.feedback.dto.FeedbackDTO;
import com.hostel.feedback.entity.Feedback;
import com.hostel.feedback.repository.FeedbackRepository;
import com.hostel.feedback.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    @Mock
    private FeedbackRepository repo;

    private FeedbackService service;

    @BeforeEach
    void setUp() {
        service = new FeedbackService(repo);
    }

    @Test
    void submit_newFeedback_savesToDb() {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setMealId("MEAL001");
        dto.setMealType("BREAKFAST");
        dto.setRating(4);
        dto.setComment("Good");

        when(repo.findByStudentIdAndMealIdAndFeedbackDate(any(), eq("MEAL001"), any()))
                .thenReturn(Optional.empty());
        when(repo.save(any(Feedback.class))).thenAnswer(inv -> inv.getArgument(0));

        FeedbackDTO result = service.submit(100L, dto);

        assertEquals("MEAL001", result.getMealId());
        assertEquals(4, result.getRating());
        verify(repo, times(1)).save(any(Feedback.class));
    }

    @Test
    void submit_existingFeedback_updatesIt() {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setMealId("MEAL001");
        dto.setMealType("BREAKFAST");
        dto.setRating(5);
        dto.setComment("Excellent");

        Feedback existing = Feedback.builder()
                .id(1L).studentId(100L).mealId("MEAL001")
                .feedbackDate(LocalDate.now()).rating(3).build();

        when(repo.findByStudentIdAndMealIdAndFeedbackDate(any(), eq("MEAL001"), any()))
                .thenReturn(Optional.of(existing));
        when(repo.save(any(Feedback.class))).thenAnswer(inv -> inv.getArgument(0));

        FeedbackDTO result = service.submit(100L, dto);

        assertEquals(5, result.getRating());
        assertEquals("Excellent", result.getComment());
    }

    @Test
    void forMeal_returnsAllRatings() {
        Feedback f1 = Feedback.builder().id(1L).mealId("MEAL001").rating(4).build();
        Feedback f2 = Feedback.builder().id(2L).mealId("MEAL001").rating(5).build();

        when(repo.findByMealId("MEAL001")).thenReturn(List.of(f1, f2));

        List<FeedbackDTO> result = service.forMeal("MEAL001");

        assertEquals(2, result.size());
    }

    @Test
    void myFeedback_returnsStudentFeedback() {
        Feedback f = Feedback.builder().id(1L).studentId(100L).mealId("MEAL001").rating(4).build();

        when(repo.findByStudentId(100L)).thenReturn(List.of(f));

        List<FeedbackDTO> result = service.myFeedback(100L);

        assertEquals(1, result.size());
    }
}