package com.liferpg.repository;

import com.liferpg.entity.UserDailyEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDailyEventRepository extends JpaRepository<UserDailyEvent, Long> {
    Optional<UserDailyEvent> findByUserIdAndDailyEventId(Long userId, Long dailyEventId);
}
