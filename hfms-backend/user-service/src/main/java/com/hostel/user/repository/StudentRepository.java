package com.hostel.user.repository;

import com.hostel.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByActiveTrue();

    List<Student> findByType(String type);

    boolean existsByRollNo(String rollNo);

    Optional<Student> findByRollNo(String rollNo);
}