package com.liferpg.repository;

import com.liferpg.entity.UserDailyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserDailyEventRepository extends JpaRepository<UserDailyEvent, Long> {
    Optional<UserDailyEvent> findByUserIdAndDailyEventId(Long userId, Long dailyEventId);
}
