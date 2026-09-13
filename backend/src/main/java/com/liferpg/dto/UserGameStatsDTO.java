package com.liferpg.dto;

import java.util.Map;

public class UserGameStatsDTO {

    private int totalGamesPlayed;
    private int totalGamesWon;
    private int currentStreak;
    private int longestStreak;
    private long totalXpEarned;
    private long totalGoldEarned;
    private int overallBestScore;
    private double overallAccuracy;
    private String favoriteGame;
    private Map<String, Integer> bestScoreByGame;

    public UserGameStatsDTO() {}

    public int getTotalGamesPlayed() { return totalGamesPlayed; }
    public void setTotalGamesPlayed(int totalGamesPlayed) { this.totalGamesPlayed = totalGamesPlayed; }

    public int getTotalGamesWon() { return totalGamesWon; }
    public void setTotalGamesWon(int totalGamesWon) { this.totalGamesWon = totalGamesWon; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public long getTotalXpEarned() { return totalXpEarned; }
    public void setTotalXpEarned(long totalXpEarned) { this.totalXpEarned = totalXpEarned; }

    public long getTotalGoldEarned() { return totalGoldEarned; }
    public void setTotalGoldEarned(long totalGoldEarned) { this.totalGoldEarned = totalGoldEarned; }

    public int getOverallBestScore() { return overallBestScore; }
    public void setOverallBestScore(int overallBestScore) { this.overallBestScore = overallBestScore; }

    public double getOverallAccuracy() { return overallAccuracy; }
    public void setOverallAccuracy(double overallAccuracy) { this.overallAccuracy = overallAccuracy; }

    public String getFavoriteGame() { return favoriteGame; }
    public void setFavoriteGame(String favoriteGame) { this.favoriteGame = favoriteGame; }

    public Map<String, Integer> getBestScoreByGame() { return bestScoreByGame; }
    public void setBestScoreByGame(Map<String, Integer> bestScoreByGame) { this.bestScoreByGame = bestScoreByGame; }
}
