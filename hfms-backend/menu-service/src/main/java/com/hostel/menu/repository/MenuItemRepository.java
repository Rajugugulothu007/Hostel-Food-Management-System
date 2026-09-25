package com.hostel.menu.repository;

import com.hostel.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, String> {

    List<MenuItem> findByMealTypeAndActiveTrue(String mealType);

    List<MenuItem> findByActiveTrue();

    boolean existsByItemName(String itemName);
}