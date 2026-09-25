package com.hostel.user.mapper;

import com.hostel.user.dto.StudentDTO;
import com.hostel.user.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentDTO toDTO(Student s) {
        StudentDTO d = new StudentDTO();
        d.setId(s.getId());
        d.setName(s.getName());
        d.setRollNo(s.getRollNo());
        d.setRoomNo(s.getRoomNo());
        d.setPhone(s.getPhone());
        d.setEmail(s.getEmail());
        d.setHostelId(s.getHostelId());
        d.setActive(s.getActive());
        return d;
    }

    public Student toEntity(StudentDTO d) {
        return Student.builder()
                .id(d.getId())
                .name(d.getName())
                .rollNo(d.getRollNo())
                .roomNo(d.getRoomNo())
                .phone(d.getPhone())
                .email(d.getEmail())
                .hostelId(d.getHostelId())
                .active(d.getActive() == null ? true : d.getActive())
                .build();
    }
}