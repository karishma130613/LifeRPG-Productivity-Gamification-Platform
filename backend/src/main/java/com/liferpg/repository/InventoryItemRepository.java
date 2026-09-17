package com.liferpg.repository;

import com.liferpg.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByUserId(Long userId);
    Optional<InventoryItem> findByUserIdAndShopItemId(Long userId, Long shopItemId);
    Boolean existsByUserIdAndShopItemId(Long userId, Long shopItemId);
}
