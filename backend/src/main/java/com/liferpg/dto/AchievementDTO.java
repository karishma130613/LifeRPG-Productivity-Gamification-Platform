package com.liferpg.dto;

import java.time.LocalDateTime;

public class AchievementDTO {

    private Long id;
    private String code;
    private String name;
    private String description;
    private String category;
    private Integer xpReward;
    private Integer goldReward;
    private String badgeIcon;
    private String requirementType;
    private Integer requirementValue;
    private Boolean isUnlocked;
    private LocalDateTime unlockedAt;

    public AchievementDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public Integer getGoldReward() { return goldReward; }
    public void setGoldReward(Integer goldReward) { this.goldReward = goldReward; }

    public String getBadgeIcon() { return badgeIcon; }
    public void setBadgeIcon(String badgeIcon) { this.badgeIcon = badgeIcon; }

    public String getRequirementType() { return requirementType; }
    public void setRequirementType(String requirementType) { this.requirementType = requirementType; }

    public Integer getRequirementValue() { return requirementValue; }
    public void setRequirementValue(Integer requirementValue) { this.requirementValue = requirementValue; }

    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }

    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
}
