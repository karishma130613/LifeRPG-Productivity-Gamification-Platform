package com.liferpg.repository;

import com.liferpg.entity.MainQuest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MainQuestRepository extends JpaRepository<MainQuest, Long> {
    List<MainQuest> findByUserId(Long userId);
}
