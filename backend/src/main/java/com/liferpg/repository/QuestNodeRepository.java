package com.liferpg.repository;

import com.liferpg.entity.QuestNode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestNodeRepository extends JpaRepository<QuestNode, Long> {
    List<QuestNode> findByMainQuestId(Long mainQuestId);
    Optional<QuestNode> findByQuestId(Long questId);
}

