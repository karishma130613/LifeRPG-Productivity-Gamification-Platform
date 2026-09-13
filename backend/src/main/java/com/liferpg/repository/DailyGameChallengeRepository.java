package com.liferpg.repository;

import com.liferpg.entity.DailyGameChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyGameChallengeRepository extends JpaRepository<DailyGameChallenge, Long> {
    Optional<DailyGameChallenge> findByUserIdAndChallengeDate(Long userId, LocalDate challengeDate);
}
