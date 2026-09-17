package com.liferpg.repository;

import com.liferpg.entity.UserWorldProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserWorldProgressRepository extends JpaRepository<UserWorldProgress, Long> {
    List<UserWorldProgress> findByUserId(Long userId);
    Optional<UserWorldProgress> findByUserIdAndRegionId(Long userId, Long regionId);
}
