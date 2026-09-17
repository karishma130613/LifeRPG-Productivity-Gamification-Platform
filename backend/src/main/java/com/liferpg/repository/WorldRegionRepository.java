package com.liferpg.repository;

import com.liferpg.entity.WorldRegion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorldRegionRepository extends JpaRepository<WorldRegion, Long> {
    Optional<WorldRegion> findByRegionName(String regionName);
}
