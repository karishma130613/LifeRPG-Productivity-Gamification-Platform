package com.liferpg.dto;

import java.util.List;

public class QuestCompletionResultDTO {

    private QuestDTO quest;
    private CharacterDTO updatedCharacter;
    private Integer xpGained;
    private Integer goldGained;
    private Boolean leveledUp;
    private Integer oldLevel;
    private Integer newLevel;
    private Integer streakGained;
    private String attributeGained;
    private Integer attributeAmount;
    private List<String> achievementsUnlocked;
    private List<String> regionsUnlocked;
    private Integer bossDamageDealt;
    private Boolean bossDefeated;

    public QuestCompletionResultDTO() {
    }

    // Getters and Setters
    public QuestDTO getQuest() { return quest; }
    public void setQuest(QuestDTO quest) { this.quest = quest; }

    public CharacterDTO getUpdatedCharacter() { return updatedCharacter; }
    public void setUpdatedCharacter(CharacterDTO updatedCharacter) { this.updatedCharacter = updatedCharacter; }

    public Integer getXpGained() { return xpGained; }
    public void setXpGained(Integer xpGained) { this.xpGained = xpGained; }

    public Integer getGoldGained() { return goldGained; }
    public void setGoldGained(Integer goldGained) { this.goldGained = goldGained; }

    public Boolean getLeveledUp() { return leveledUp; }
    public void setLeveledUp(Boolean leveledUp) { this.leveledUp = leveledUp; }

    public Integer getOldLevel() { return oldLevel; }
    public void setOldLevel(Integer oldLevel) { this.oldLevel = oldLevel; }

    public Integer getNewLevel() { return newLevel; }
    public void setNewLevel(Integer newLevel) { this.newLevel = newLevel; }

    public Integer getStreakGained() { return streakGained; }
    public void setStreakGained(Integer streakGained) { this.streakGained = streakGained; }

    public String getAttributeGained() { return attributeGained; }
    public void setAttributeGained(String attributeGained) { this.attributeGained = attributeGained; }

    public Integer getAttributeAmount() { return attributeAmount; }
    public void setAttributeAmount(Integer attributeAmount) { this.attributeAmount = attributeAmount; }

    public List<String> getAchievementsUnlocked() { return achievementsUnlocked; }
    public void setAchievementsUnlocked(List<String> achievementsUnlocked) { this.achievementsUnlocked = achievementsUnlocked; }

    public List<String> getRegionsUnlocked() { return regionsUnlocked; }
    public void setRegionsUnlocked(List<String> regionsUnlocked) { this.regionsUnlocked = regionsUnlocked; }

    public Integer getBossDamageDealt() { return bossDamageDealt; }
    public void setBossDamageDealt(Integer bossDamageDealt) { this.bossDamageDealt = bossDamageDealt; }

    public Boolean getBossDefeated() { return bossDefeated; }
    public void setBossDefeated(Boolean bossDefeated) { this.bossDefeated = bossDefeated; }
}
