package com.liferpg.repository;

import com.liferpg.entity.DailyEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyEventRepository extends JpaRepository<DailyEvent, Long> {
    Optional<DailyEvent> findByEventDate(LocalDate eventDate);
}
