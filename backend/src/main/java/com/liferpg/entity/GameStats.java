package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "game_stats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "game_id"})
})
public class GameStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "game_id", nullable = false, length = 50)
    private String gameId;

    @Column(name = "games_played", nullable = false)
    private int gamesPlayed = 0;

    @Column(name = "games_won", nullable = false)
    private int gamesWon = 0;

    @Column(name = "best_score", nullable = false)
    private int bestScore = 0;

    @Column(name = "current_streak", nullable = false)
    private int currentStreak = 0;

    @Column(name = "longest_streak", nullable = false)
    private int longestStreak = 0;

    @Column(name = "last_played_date")
    private LocalDate lastPlayedDate;

    @Column(name = "total_xp_earned", nullable = false)
    private long totalXpEarned = 0;

    @Column(name = "total_gold_earned", nullable = false)
    private long totalGoldEarned = 0;

    public GameStats() {}

    public GameStats(User user, String gameId) {
        this.user = user;
        this.gameId = gameId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public int getGamesPlayed() { return gamesPlayed; }
    public void setGamesPlayed(int gamesPlayed) { this.gamesPlayed = gamesPlayed; }

    public int getGamesWon() { return gamesWon; }
    public void setGamesWon(int gamesWon) { this.gamesWon = gamesWon; }

    public int getBestScore() { return bestScore; }
    public void setBestScore(int bestScore) { this.bestScore = bestScore; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }

    public LocalDate getLastPlayedDate() { return lastPlayedDate; }
    public void setLastPlayedDate(LocalDate lastPlayedDate) { this.lastPlayedDate = lastPlayedDate; }

    public long getTotalXpEarned() { return totalXpEarned; }
    public void setTotalXpEarned(long totalXpEarned) { this.totalXpEarned = totalXpEarned; }

    public long getTotalGoldEarned() { return totalGoldEarned; }
    public void setTotalGoldEarned(long totalGoldEarned) { this.totalGoldEarned = totalGoldEarned; }
}
