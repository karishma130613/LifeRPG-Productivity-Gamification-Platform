package com.liferpg.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class QuestDTO {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private Integer xpReward;
    private Integer goldReward;
    private LocalDate dueDate;
    private String priority;
    private Boolean isMainQuest;
    private String status;
    private String proofUrl;
    private String proofNotes;
    private Long bossId;
    private String gameType;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public QuestDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public Long getBossId() { return bossId; }
    public void setBossId(Long bossId) { this.bossId = bossId; }

    public String getGameType() { return gameType; }
    public void setGameType(String gameType) { this.gameType = gameType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
