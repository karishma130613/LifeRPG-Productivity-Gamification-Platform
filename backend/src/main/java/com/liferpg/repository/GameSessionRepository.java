package com.liferpg.repository;

import com.liferpg.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, String> {
    Optional<GameSession> findByIdAndUserId(String id, Long userId);
    List<GameSession> findByUserIdOrderByStartedAtDesc(Long userId);
    List<GameSession> findTop10ByUserIdAndStatusOrderByCompletedAtDesc(Long userId, String status);
}
