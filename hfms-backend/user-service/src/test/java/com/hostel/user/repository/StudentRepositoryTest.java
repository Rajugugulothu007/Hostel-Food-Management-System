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

    private Student sample(String rollNo, String name, String type, boolean active) {
        return Student.builder()
                .name(name)
                .rollNo(rollNo)
                .type(type)
                .active(active)
                .build();
    }

    @Test
    void save_persistsStudent() {
        Student saved = repo.save(sample("22CS001", "Arjun", "HOSTELLER", true));

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Arjun");
        assertThat(saved.getRollNo()).isEqualTo("22CS001");
        assertThat(saved.getType()).isEqualTo("HOSTELLER");
    }

    @Test
    void existsByRollNo_returnsTrueForExisting() {
        repo.save(sample("22CS001", "Arjun", "HOSTELLER", true));

        assertThat(repo.existsByRollNo("22CS001")).isTrue();
        assertThat(repo.existsByRollNo("99XX999")).isFalse();
    }

    @Test
    void findByActiveTrue_returnsOnlyActiveStudents() {
        repo.save(sample("22CS001", "Arjun", "HOSTELLER", true));
        repo.save(sample("22CS002", "Priya", "HOSTELLER", true));
        repo.save(sample("21CS999", "Old", "HOSTELLER", false));

        List<Student> active = repo.findByActiveTrue();

        assertThat(active).hasSize(2);
        assertThat(active).extracting(Student::getName)
                .containsExactlyInAnyOrder("Arjun", "Priya");
    }

    @Test
    void findByType_returnsFiltered() {
        repo.save(sample("22CS001", "Arjun", "HOSTELLER", true));
        repo.save(sample("22DS001", "Ravi", "DAY_SCHOLAR", true));
        repo.save(sample("22DS002", "Sanjay", "DAY_SCHOLAR", true));

        List<Student> dayScholars = repo.findByType("DAY_SCHOLAR");

        assertThat(dayScholars).hasSize(2);
        assertThat(dayScholars).extracting(Student::getType)
                .containsOnly("DAY_SCHOLAR");
    }

    @Test
    void findByRollNo_returnsStudent() {
        repo.save(sample("22CS001", "Arjun", "HOSTELLER", true));

        Optional<Student> found = repo.findByRollNo("22CS001");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Arjun");
    }

    @Test
    void findById_returnsStudent() {
        Student saved = repo.save(sample("22CS001", "Arjun", "HOSTELLER", true));

        Optional<Student> found = repo.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Arjun");
    }
}