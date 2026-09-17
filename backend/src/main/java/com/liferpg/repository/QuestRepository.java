package com.liferpg.repository;

import com.liferpg.entity.Quest;
import com.liferpg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByUserId(Long userId);
    List<Quest> findByUserIdAndStatus(Long userId, String status);
    List<Quest> findByUserIdAndCategory(Long userId, String category);
    
    @Query("SELECT COUNT(q) FROM Quest q WHERE q.user.id = :userId AND q.status = 'COMPLETED'")
    long countCompletedByUserId(@Param("userId") Long userId);

    @Query("SELECT q.category, COUNT(q) FROM Quest q WHERE q.user.id = :userId AND q.status = 'COMPLETED' GROUP BY q.category")
    List<Object[]> countCompletedCategoryStatsByUserId(@Param("userId") Long userId);
}
