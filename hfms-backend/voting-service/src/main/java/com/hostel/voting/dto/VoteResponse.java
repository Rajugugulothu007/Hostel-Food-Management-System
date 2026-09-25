// File: voting-service/src/main/java/com/hostel/voting/dto/VoteResponse.java
package com.hostel.voting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VoteResponse {
    private String status;
    private String mealId;
    private String mealType;
    private String message;
}