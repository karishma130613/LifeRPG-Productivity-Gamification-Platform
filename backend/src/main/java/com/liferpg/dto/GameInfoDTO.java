package com.liferpg.dto;

import java.util.List;

public class GameInfoDTO {

    private String id;
    private String name;
    private String description;
    private String category;
    private String zoneName;
    private int requiredLevel;
    private boolean isUnlocked;
    private String estimatedTime;
    private String iconName;
    private String attributeType;
    private int baseHpDamage;
    private int bestScore;
    private List<String> availableDifficulties;

    public GameInfoDTO() {}

    public GameInfoDTO(String id, String name, String description, String category, String zoneName,
                       int requiredLevel, boolean isUnlocked, String estimatedTime, String iconName,
                       String attributeType, int baseHpDamage, int bestScore, List<String> availableDifficulties) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.zoneName = zoneName;
        this.requiredLevel = requiredLevel;
        this.isUnlocked = isUnlocked;
        this.estimatedTime = estimatedTime;
        this.iconName = iconName;
        this.attributeType = attributeType;
        this.baseHpDamage = baseHpDamage;
        this.bestScore = bestScore;
        this.availableDifficulties = availableDifficulties;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public int getRequiredLevel() { return requiredLevel; }
    public void setRequiredLevel(int requiredLevel) { this.requiredLevel = requiredLevel; }

    public boolean isUnlocked() { return isUnlocked; }
    public void setUnlocked(boolean unlocked) { isUnlocked = unlocked; }

    public String getEstimatedTime() { return estimatedTime; }
    public void setEstimatedTime(String estimatedTime) { this.estimatedTime = estimatedTime; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public String getAttributeType() { return attributeType; }
    public void setAttributeType(String attributeType) { this.attributeType = attributeType; }

    public int getBaseHpDamage() { return baseHpDamage; }
    public void setBaseHpDamage(int baseHpDamage) { this.baseHpDamage = baseHpDamage; }

    public int getBestScore() { return bestScore; }
    public void setBestScore(int bestScore) { this.bestScore = bestScore; }

    public List<String> getAvailableDifficulties() { return availableDifficulties; }
    public void setAvailableDifficulties(List<String> availableDifficulties) { this.availableDifficulties = availableDifficulties; }
}
