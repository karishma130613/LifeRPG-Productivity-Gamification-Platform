package com.liferpg.repository;

import com.liferpg.entity.DailyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyEventRepository extends JpaRepository<DailyEvent, Long> {
    Optional<DailyEvent> findByEventDate(LocalDate eventDate);
}
