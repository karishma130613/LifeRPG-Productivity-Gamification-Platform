package com.liferpg.dto;

public class DailyChallengeDTO {

    private String date;
    private int targetCount;
    private int completedCount;
    private boolean isClaimed;
    private boolean isReadyToClaim;
    private int xpReward = 150;
    private int goldReward = 75;

    public DailyChallengeDTO() {}

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getTargetCount() { return targetCount; }
    public void setTargetCount(int targetCount) { this.targetCount = targetCount; }

    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }

    public boolean isClaimed() { return isClaimed; }
    public void setClaimed(boolean claimed) { isClaimed = claimed; }

    public boolean isReadyToClaim() { return isReadyToClaim; }
    public void setReadyToClaim(boolean readyToClaim) { isReadyToClaim = readyToClaim; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public int getGoldReward() { return goldReward; }
    public void setGoldReward(int goldReward) { this.goldReward = goldReward; }
}
