package com.liferpg.dto;

import java.util.List;

public class GameResultDTO {

    private boolean success;
    private String message;
    private int score;
    private double accuracy;
    private int xpEarned;
    private int goldEarned;
    private boolean leveledUp;
    private int newLevel;
    private int bossDamageDealt;
    private boolean bossDefeated;
    private Integer remainingBossHp;
    private String bossName;
    private String attributeBoosted;
    private int currentStreak;
    private int streakBonusGold;
    private int dailyChallengeCompleted;
    private int dailyChallengeTarget;
    private boolean dailyChallengeReadyToClaim;
    private List<String> achievementsUnlocked;
    private CharacterDTO updatedCharacter;

    public GameResultDTO() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

    public int getGoldEarned() { return goldEarned; }
    public void setGoldEarned(int goldEarned) { this.goldEarned = goldEarned; }

    public boolean isLeveledUp() { return leveledUp; }
    public void setLeveledUp(boolean leveledUp) { this.leveledUp = leveledUp; }

    public int getNewLevel() { return newLevel; }
    public void setNewLevel(int newLevel) { this.newLevel = newLevel; }

    public int getBossDamageDealt() { return bossDamageDealt; }
    public void setBossDamageDealt(int bossDamageDealt) { this.bossDamageDealt = bossDamageDealt; }

    public boolean isBossDefeated() { return bossDefeated; }
    public void setBossDefeated(boolean bossDefeated) { this.bossDefeated = bossDefeated; }

    public Integer getRemainingBossHp() { return remainingBossHp; }
    public void setRemainingBossHp(Integer remainingBossHp) { this.remainingBossHp = remainingBossHp; }

    public String getBossName() { return bossName; }
    public void setBossName(String bossName) { this.bossName = bossName; }

    public String getAttributeBoosted() { return attributeBoosted; }
    public void setAttributeBoosted(String attributeBoosted) { this.attributeBoosted = attributeBoosted; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }

    public int getStreakBonusGold() { return streakBonusGold; }
    public void setStreakBonusGold(int streakBonusGold) { this.streakBonusGold = streakBonusGold; }

    public int getDailyChallengeCompleted() { return dailyChallengeCompleted; }
    public void setDailyChallengeCompleted(int dailyChallengeCompleted) { this.dailyChallengeCompleted = dailyChallengeCompleted; }

    public int getDailyChallengeTarget() { return dailyChallengeTarget; }
    public void setDailyChallengeTarget(int dailyChallengeTarget) { this.dailyChallengeTarget = dailyChallengeTarget; }

    public boolean isDailyChallengeReadyToClaim() { return dailyChallengeReadyToClaim; }
    public void setDailyChallengeReadyToClaim(boolean dailyChallengeReadyToClaim) { this.dailyChallengeReadyToClaim = dailyChallengeReadyToClaim; }

    public List<String> getAchievementsUnlocked() { return achievementsUnlocked; }
    public void setAchievementsUnlocked(List<String> achievementsUnlocked) { this.achievementsUnlocked = achievementsUnlocked; }

    public CharacterDTO getUpdatedCharacter() { return updatedCharacter; }
    public void setUpdatedCharacter(CharacterDTO updatedCharacter) { this.updatedCharacter = updatedCharacter; }
}
