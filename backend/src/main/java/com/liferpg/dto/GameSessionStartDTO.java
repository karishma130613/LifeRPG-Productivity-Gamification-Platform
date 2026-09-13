package com.liferpg.dto;

import java.time.LocalDateTime;

public class GameSessionStartDTO {

    private String sessionId;
    private String gameId;
    private String difficulty;
    private LocalDateTime startedAt;
    private Long linkedQuestId;

    public GameSessionStartDTO() {}

    public GameSessionStartDTO(String sessionId, String gameId, String difficulty, LocalDateTime startedAt, Long linkedQuestId) {
        this.sessionId = sessionId;
        this.gameId = gameId;
        this.difficulty = difficulty;
        this.startedAt = startedAt;
        this.linkedQuestId = linkedQuestId;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public Long getLinkedQuestId() { return linkedQuestId; }
    public void setLinkedQuestId(Long linkedQuestId) { this.linkedQuestId = linkedQuestId; }
}
