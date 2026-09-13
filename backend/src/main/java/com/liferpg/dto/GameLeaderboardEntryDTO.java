package com.liferpg.dto;

public class GameLeaderboardEntryDTO {

    private int rank;
    private String username;
    private String avatar;
    private String className;
    private int level;
    private String gameId;
    private int bestScore;
    private int gamesWon;

    public GameLeaderboardEntryDTO() {}

    public GameLeaderboardEntryDTO(int rank, String username, String avatar, String className, int level, String gameId, int bestScore, int gamesWon) {
        this.rank = rank;
        this.username = username;
        this.avatar = avatar;
        this.className = className;
        this.level = level;
        this.gameId = gameId;
        this.bestScore = bestScore;
        this.gamesWon = gamesWon;
    }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public int getBestScore() { return bestScore; }
    public void setBestScore(int bestScore) { this.bestScore = bestScore; }

    public int getGamesWon() { return gamesWon; }
    public void setGamesWon(int gamesWon) { this.gamesWon = gamesWon; }
}
