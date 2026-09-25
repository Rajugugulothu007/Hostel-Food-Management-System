package com.hostel.auth.repository;

import com.hostel.auth.entity.UserCredential;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserCredentialRepositoryTest {

    @Autowired
    private UserCredentialRepository repo;

    @Test
    void findByUsername_returnsUser() {
        UserCredential saved = repo.save(UserCredential.builder()
                .username("arjun")
                .passwordHash("$2a$10$dummyhash")
                .role("STUDENT")
                .createdAt(LocalDateTime.now())
                .build());

        Optional<UserCredential> found = repo.findByUsername("arjun");

        assertThat(found).isPresent();
        assertThat(found.get().getId()).isEqualTo(saved.getId());
        assertThat(found.get().getRole()).isEqualTo("STUDENT");
    }

    @Test
    void findByUsername_userDoesNotExist_returnsEmpty() {
        Optional<UserCredential> found = repo.findByUsername("nobody");

        assertThat(found).isEmpty();
    }

    @Test
    void existsByUsername_returnsTrueForExistingUser() {
        repo.save(UserCredential.builder()
                .username("arjun")
                .passwordHash("$2a$10$dummyhash")
                .role("STUDENT")
                .build());

        assertThat(repo.existsByUsername("arjun")).isTrue();
        assertThat(repo.existsByUsername("nobody")).isFalse();
    }

    @Test
    void save_persistsUser() {
        UserCredential user = UserCredential.builder()
                .username("admin")
                .passwordHash("$2a$10$dummyhash")
                .role("ADMIN")
                .createdAt(LocalDateTime.now())
                .build();

        UserCredential saved = repo.save(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUsername()).isEqualTo("admin");
        assertThat(saved.getRole()).isEqualTo("ADMIN");
    }
}