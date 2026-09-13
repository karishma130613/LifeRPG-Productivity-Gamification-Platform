package com.liferpg.repository;

import com.liferpg.entity.GameStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameStatsRepository extends JpaRepository<GameStats, Long> {
    List<GameStats> findByUserId(Long userId);
    Optional<GameStats> findByUserIdAndGameId(Long userId, String gameId);
    List<GameStats> findTop10ByGameIdOrderByBestScoreDesc(String gameId);
}
