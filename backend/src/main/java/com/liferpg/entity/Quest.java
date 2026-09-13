package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "quests")
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 20)
    private String difficulty = "MEDIUM";

    @Column(name = "xp_reward", nullable = false)
    private Integer xpReward;

    @Column(name = "gold_reward", nullable = false)
    private Integer goldReward;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(length = 20)
    private String priority = "MEDIUM";

    @Column(name = "is_main_quest")
    private Boolean isMainQuest = false;

    @Column(length = 20)
    private String status = "AVAILABLE"; // AVAILABLE, IN_PROGRESS, COMPLETED, LOCKED

    @Column(name = "proof_url", length = 500)
    private String proofUrl;

    @Column(name = "proof_notes", columnDefinition = "TEXT")
    private String proofNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boss_id")
    private BossBattle boss;

    @Column(name = "game_type", length = 50)
    private String gameType;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public Quest() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public Integer getGoldReward() { return goldReward; }
    public void setGoldReward(Integer goldReward) { this.goldReward = goldReward; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Boolean getIsMainQuest() { return isMainQuest; }
    public void setIsMainQuest(Boolean isMainQuest) { this.isMainQuest = isMainQuest; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProofUrl() { return proofUrl; }
    public void setProofUrl(String proofUrl) { this.proofUrl = proofUrl; }

    public String getProofNotes() { return proofNotes; }
    public void setProofNotes(String proofNotes) { this.proofNotes = proofNotes; }

    public BossBattle getBoss() { return boss; }
    public void setBoss(BossBattle boss) { this.boss = boss; }

    public String getGameType() { return gameType; }
    public void setGameType(String gameType) { this.gameType = gameType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
