package com.hostel.user;

import com.hostel.user.dto.StudentDTO;
import com.hostel.user.entity.Student;
import com.hostel.user.mapper.StudentMapper;
import com.hostel.user.repository.StudentRepository;
import com.hostel.user.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository repo;

    private StudentMapper mapper;
    private StudentService service;

    @BeforeEach
    void setUp() {
        mapper = new StudentMapper();
        service = new StudentService(repo, mapper);
    }

    // ---------- CREATE TESTS ----------

    @Test
    void create_success_savesStudent() {
        StudentDTO dto = new StudentDTO();
        dto.setName("Arjun");
        dto.setRollNo("22CS001");
        dto.setRoomNo("A101");

        when(repo.existsByRollNo("22CS001")).thenReturn(false);
        when(repo.save(any(Student.class))).thenAnswer(inv -> {
            Student s = inv.getArgument(0);
            s.setId(1L);
            return s;
        });

        StudentDTO result = service.create(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Arjun", result.getName());
        assertEquals("22CS001", result.getRollNo());
        verify(repo, times(1)).save(any(Student.class));
    }

    @Test
    void create_duplicateRollNo_throws() {
        StudentDTO dto = new StudentDTO();
        dto.setName("Arjun");
        dto.setRollNo("22CS001");

        when(repo.existsByRollNo("22CS001")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.create(dto));

        assertEquals("Roll number already exists", ex.getMessage());
        verify(repo, never()).save(any());
    }

    // ---------- LIST TESTS ----------

    @Test
    void listAll_returnsAllStudents() {
        Student s1 = Student.builder().id(1L).name("Arjun").rollNo("22CS001").active(true).build();
        Student s2 = Student.builder().id(2L).name("Priya").rollNo("22CS002").active(true).build();

        when(repo.findAll()).thenReturn(List.of(s1, s2));

        List<StudentDTO> result = service.listAll();

        assertEquals(2, result.size());
        assertEquals("Arjun", result.get(0).getName());
        assertEquals("Priya", result.get(1).getName());
    }

    @Test
    void listAll_emptyRepo_returnsEmptyList() {
        when(repo.findAll()).thenReturn(List.of());

        List<StudentDTO> result = service.listAll();

        assertTrue(result.isEmpty());
    }

    // ---------- GET BY ID TESTS ----------

    @Test
    void getById_found_returnsDTO() {
        Student s = Student.builder().id(1L).name("Arjun").rollNo("22CS001").active(true).build();

        when(repo.findById(1L)).thenReturn(Optional.of(s));

        StudentDTO result = service.getById(1L);

        assertEquals(1L, result.getId());
        assertEquals("Arjun", result.getName());
    }

    @Test
    void getById_notFound_throws() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.getById(99L));

        assertEquals("Student not found", ex.getMessage());
    }

    // ---------- UPDATE TESTS ----------

    @Test
    void update_success_updatesFields() {
        Student existing = Student.builder()
                .id(1L).name("Arjun").rollNo("22CS001").roomNo("A101").active(true).build();

        StudentDTO dto = new StudentDTO();
        dto.setName("Arjun Kumar");
        dto.setRoomNo("A102");
        dto.setPhone("9876543210");
        dto.setActive(true);

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        StudentDTO result = service.update(1L, dto);

        assertEquals("Arjun Kumar", result.getName());
        assertEquals("A102", result.getRoomNo());
        assertEquals("9876543210", result.getPhone());
    }

    @Test
    void update_notFound_throws() {
        StudentDTO dto = new StudentDTO();
        dto.setName("X");

        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.update(99L, dto));
    }

    // ---------- DELETE TESTS ----------

    @Test
    void delete_setsActiveFalse() {
        Student existing = Student.builder()
                .id(1L).name("Arjun").rollNo("22CS001").active(true).build();

        when(repo.findById(1L)).thenReturn(Optional.of(existing));
        when(repo.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        service.delete(1L);

        assertFalse(existing.getActive());
        verify(repo, times(1)).save(existing);
    }

    @Test
    void delete_notFound_throws() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.delete(99L));
    }
}