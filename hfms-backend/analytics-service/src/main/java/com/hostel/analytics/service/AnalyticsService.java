package com.hostel.analytics.service;

import com.hostel.analytics.client.ServiceClient;
import com.hostel.analytics.dto.DashboardSummaryDTO;
import com.hostel.analytics.dto.MealCountDTO;
import com.hostel.analytics.dto.WastageTrendDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ServiceClient client;

    /** Map "mealType → [mealId1, mealId2, ...]" for today */
    private static final Map<String, List<String>> MEALS = Map.of(
            "BREAKFAST", List.of("MEAL001", "MEAL002", "MEAL003"),
            "LUNCH",     List.of("MEAL011", "MEAL012", "MEAL013"),
            "DINNER",    List.of("MEAL021", "MEAL022", "MEAL023")
    );

    public DashboardSummaryDTO dashboard(String authHeader) {
        List<MealCountDTO> mealCounts = new ArrayList<>();
        long totalSurplus = 0;
        long totalFeedback = 0;
        String topMeal = "N/A";
        long topCount = 0;

        for (Map.Entry<String, List<String>> entry : MEALS.entrySet()) {
            String mealType = entry.getKey();
            long votes = 0;
            long checkIns = 0;

            for (String mealId : entry.getValue()) {
                try {
                    Map<String, Object> voteRes = client.getVoteCount(mealId, authHeader);
                    votes += toLong(voteRes.get("count"));

                    Map<String, Object> checkRes = client.getCheckInCount(mealId, authHeader);
                    checkIns += toLong(checkRes.get("count"));
                } catch (Exception ignored) {
                    // Service might not be running — skip gracefully
                }
            }

            double wastage = votes == 0 ? 0.0 : ((double)(votes - checkIns) / votes) * 100.0;
            wastage = Math.max(wastage, 0.0);

            mealCounts.add(new MealCountDTO(mealType, votes, checkIns, wastage));

            if (votes > topCount) {
                topCount = votes;
                topMeal = mealType;
            }
        }

        // Surplus
        try {
            var surplus = client.getTodaySurplus(authHeader);
            for (Map<String, Object> s : surplus) {
                totalSurplus += toLong(s.get("surplusQty"));
            }
        } catch (Exception ignored) { }

        // Feedback count (count feedback for one sample meal per type)
        for (List<String> ids : MEALS.values()) {
            for (String mealId : ids) {
                try {
                    totalFeedback += client.getTodayFeedback(mealId, authHeader).size();
                } catch (Exception ignored) { }
            }
        }

        return new DashboardSummaryDTO(
                LocalDateTime.now(),
                mealCounts,
                totalSurplus,
                totalFeedback,
                topMeal
        );
    }

    public WastageTrendDTO wastage(String authHeader) {
        DashboardSummaryDTO dash = dashboard(authHeader);

        double overall = dash.getMealCounts().stream()
                .mapToDouble(MealCountDTO::getWastagePercent)
                .average()
                .orElse(0.0);

        return new WastageTrendDTO(
                "TODAY",
                dash.getMealCounts(),
                dash.getTotalSurplusToday(),
                overall
        );
    }

    private long toLong(Object o) {
        if (o == null) return 0L;
        if (o instanceof Number n) return n.longValue();
        try {
            return Long.parseLong(o.toString());
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
}