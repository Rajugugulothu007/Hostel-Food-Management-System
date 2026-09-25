package com.hostel.menu.repository;

import com.hostel.menu.entity.MenuItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class MenuItemRepositoryTest {

    @Autowired
    private MenuItemRepository repo;

    private MenuItem sampleItem(String id, String mealType, boolean active) {
        return MenuItem.builder()
                .id(id)
                .itemName("Test Item " + id)
                .mealType(mealType)
                .active(active)
                .build();
    }

    @Test
    void save_persistsItem() {
        MenuItem saved = repo.save(sampleItem("MEAL100", "BREAKFAST", true));

        assertThat(saved.getId()).isEqualTo("MEAL100");
        assertThat(saved.getItemName()).isEqualTo("Test Item MEAL100");
    }

    @Test
    void findByMealTypeAndActiveTrue_returnsOnlyActive() {
        repo.save(sampleItem("MEAL001", "BREAKFAST", true));
        repo.save(sampleItem("MEAL002", "BREAKFAST", true));
        repo.save(sampleItem("MEAL003", "BREAKFAST", false));
        repo.save(sampleItem("MEAL004", "LUNCH", true));

        List<MenuItem> result = repo.findByMealTypeAndActiveTrue("BREAKFAST");

        assertThat(result).hasSize(2);
        assertThat(result).extracting(MenuItem::getId)
                .containsExactlyInAnyOrder("MEAL001", "MEAL002");
    }

    @Test
    void findByActiveTrue_returnsAllActive() {
        repo.save(sampleItem("MEAL001", "BREAKFAST", true));
        repo.save(sampleItem("MEAL002", "LUNCH", true));
        repo.save(sampleItem("MEAL003", "DINNER", false));

        List<MenuItem> result = repo.findByActiveTrue();

        assertThat(result).hasSize(2);
    }

    @Test
    void existsById_returnsTrueForExisting() {
        repo.save(sampleItem("MEAL100", "BREAKFAST", true));

        assertThat(repo.existsById("MEAL100")).isTrue();
        assertThat(repo.existsById("NOPE")).isFalse();
    }
}