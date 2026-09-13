package com.liferpg.dto;

import java.time.LocalDateTime;

public class WorldRegionDTO {

    private Long id;
    private String regionName;
    private String description;
    private Integer minLevel;
    private String category;
    private String themeColor;
    private String iconName;
    private Boolean isUnlocked;
    private LocalDateTime unlockedAt;

    public WorldRegionDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegionName() { return regionName; }
    public void setRegionName(String regionName) { this.regionName = regionName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getMinLevel() { return minLevel; }
    public void setMinLevel(Integer minLevel) { this.minLevel = minLevel; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }

    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
}
