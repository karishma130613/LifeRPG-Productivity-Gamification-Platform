package com.liferpg.repository;

import com.liferpg.entity.WorldRegion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorldRegionRepository extends JpaRepository<WorldRegion, Long> {
    Optional<WorldRegion> findByRegionName(String regionName);
}
