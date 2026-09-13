package com.liferpg.repository;

import com.liferpg.entity.QuestNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestNodeRepository extends JpaRepository<QuestNode, Long> {
    List<QuestNode> findByMainQuestId(Long mainQuestId);
    Optional<QuestNode> findByQuestId(Long questId);
}

