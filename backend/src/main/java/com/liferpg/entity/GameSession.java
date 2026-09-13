package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_sessions")
public class GameSession {

    @Id
    @Column(length = 64)
    private String id; // UUID string

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "game_id", nullable = false, length = 50)
    private String gameId;

    @Column(nullable = false, length = 20)
    private String difficulty = "MEDIUM"; // EASY, MEDIUM, HARD, EPIC

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ABANDONED

    private Integer score = 0;

    private Double accuracy = 0.0;

    @Column(name = "linked_quest_id")
    private Long linkedQuestId;

    public GameSession() {}

    public GameSession(String id, User user, String gameId, String difficulty, Long linkedQuestId) {
        this.id = id;
        this.user = user;
        this.gameId = gameId;
        this.difficulty = difficulty != null ? difficulty : "MEDIUM";
        this.linkedQuestId = linkedQuestId;
        this.startedAt = LocalDateTime.now();
        this.status = "ACTIVE";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public Long getLinkedQuestId() { return linkedQuestId; }
    public void setLinkedQuestId(Long linkedQuestId) { this.linkedQuestId = linkedQuestId; }
}
