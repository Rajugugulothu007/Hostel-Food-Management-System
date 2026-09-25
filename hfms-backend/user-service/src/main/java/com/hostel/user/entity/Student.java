package com.hostel.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "roll_no", nullable = false, unique = true)
    private String rollNo;

    @Column(name = "room_no")
    private String roomNo;

    private String phone;

    private String email;

    @Column(name = "hostel_id")
    private Long hostelId;

    @Column(nullable = false)
    private Boolean active = true;
}