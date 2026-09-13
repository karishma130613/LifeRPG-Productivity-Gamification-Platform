package com.liferpg.repository;

import com.liferpg.entity.CharacterProfile;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CharacterProfileRepository extends JpaRepository<CharacterProfile, Long> {
    Optional<CharacterProfile> findByUser(User user);
    Optional<CharacterProfile> findByUserId(Long userId);
}
