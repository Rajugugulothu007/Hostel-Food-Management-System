package com.hostel.feedback.service;

import com.hostel.feedback.dto.FeedbackDTO;
import com.hostel.feedback.entity.Feedback;
import com.hostel.feedback.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackDTO submit(Long studentId, FeedbackDTO dto) {
        LocalDate today = LocalDate.now();

        // If already submitted feedback for this meal today → update it
        var existing = repo.findByStudentIdAndMealIdAndFeedbackDate(
                studentId, dto.getMealId(), today);

        Feedback f;
        if (existing.isPresent()) {
            f = existing.get();
            f.setRating(dto.getRating());
            f.setComment(dto.getComment());
        } else {
            f = Feedback.builder()
                    .studentId(studentId)
                    .mealId(dto.getMealId())
                    .mealType(dto.getMealType())
                    .feedbackDate(today)
                    .rating(dto.getRating())
                    .comment(dto.getComment())
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        return toDTO(repo.save(f));
    }

    public List<FeedbackDTO> forMeal(String mealId) {
        return repo.findByMealId(mealId).stream().map(this::toDTO).toList();
    }

    public List<FeedbackDTO> myFeedback(Long studentId) {
        return repo.findByStudentId(studentId).stream().map(this::toDTO).toList();
    }

    public List<Map<String, Object>> lowRated() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : repo.findLowRatedMeals()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("mealId", row[0]);
            entry.put("averageRating", row[1]);
            result.add(entry);
        }
        return result;
    }

    private FeedbackDTO toDTO(Feedback f) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(f.getId());
        dto.setMealId(f.getMealId());
        dto.setMealType(f.getMealType());
        dto.setRating(f.getRating());
        dto.setComment(f.getComment());
        return dto;
    }
}