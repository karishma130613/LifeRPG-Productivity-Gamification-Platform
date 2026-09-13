package com.liferpg.repository;

import com.liferpg.entity.BossBattle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BossBattleRepository extends JpaRepository<BossBattle, Long> {
    List<BossBattle> findByUserId(Long userId);
    Optional<BossBattle> findByUserIdAndIsDefeatedFalse(Long userId);
}
