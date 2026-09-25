package com.hostel.user.repository;

import com.hostel.user.entity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository repo;

    @Test
    void save_persistsStudent() {
        Student saved = repo.save(Student.builder()
                .name("Arjun")
                .rollNo("22CS001")
                .roomNo("A101")
                .active(true)
                .build());

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Arjun");
        assertThat(saved.getRollNo()).isEqualTo("22CS001");
    }

    @Test
    void existsByRollNo_returnsTrueForExisting() {
        repo.save(Student.builder()
                .name("Arjun").rollNo("22CS001").active(true).build());

        assertThat(repo.existsByRollNo("22CS001")).isTrue();
        assertThat(repo.existsByRollNo("99XX999")).isFalse();
    }

    @Test
    void findByActiveTrue_returnsOnlyActiveStudents() {
        repo.save(Student.builder()
                .name("Arjun").rollNo("22CS001").active(true).build());
        repo.save(Student.builder()
                .name("Priya").rollNo("22CS002").active(true).build());
        repo.save(Student.builder()
                .name("Old").rollNo("21CS999").active(false).build());

        List<Student> active = repo.findByActiveTrue();

        assertThat(active).hasSize(2);
        assertThat(active).extracting(Student::getName)
                .containsExactlyInAnyOrder("Arjun", "Priya");
    }

    @Test
    void findById_returnsStudent() {
        Student saved = repo.save(Student.builder()
                .name("Arjun").rollNo("22CS001").active(true).build());

        Optional<Student> found = repo.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Arjun");
    }

    @Test
    void findById_notFound_returnsEmpty() {
        Optional<Student> found = repo.findById(999L);
        assertThat(found).isEmpty();
    }
}