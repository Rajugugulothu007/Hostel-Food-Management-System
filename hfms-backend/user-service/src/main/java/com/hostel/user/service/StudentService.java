package com.hostel.user.service;

import com.hostel.user.dto.StudentDTO;
import com.hostel.user.entity.Student;
import com.hostel.user.mapper.StudentMapper;
import com.hostel.user.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repo;
    private final StudentMapper mapper;

    public StudentDTO create(StudentDTO dto) {
        if (repo.existsByRollNo(dto.getRollNo())) {
            throw new RuntimeException("Roll number already exists");
        }
        Student saved = repo.save(mapper.toEntity(dto));
        return mapper.toDTO(saved);
    }

    public List<StudentDTO> listAll() {
        return repo.findAll().stream().map(mapper::toDTO).toList();
    }

    public StudentDTO getById(Long id) {
        Student s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapper.toDTO(s);
    }

    public StudentDTO update(Long id, StudentDTO dto) {
        Student s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        s.setName(dto.getName());
        s.setRoomNo(dto.getRoomNo());
        s.setPhone(dto.getPhone());
        s.setEmail(dto.getEmail());
        s.setActive(dto.getActive());
        return mapper.toDTO(repo.save(s));
    }

    public void delete(Long id) {
        Student s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        s.setActive(false);
        repo.save(s);
    }
}