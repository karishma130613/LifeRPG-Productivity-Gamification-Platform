package com.liferpg.dto;

public class BossBattleDTO {

    private Long id;
    private Long userId;
    private String name;
    private String title;
    private String description;
    private String category;
    private Integer maxHp;
    private Integer currentHp;
    private Boolean isDefeated;
    private Integer xpReward;
    private Integer goldReward;
    private String iconName;

    public BossBattleDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getMaxHp() { return maxHp; }
    public void setMaxHp(Integer maxHp) { this.maxHp = maxHp; }

    public Integer getCurrentHp() { return currentHp; }
    public void setCurrentHp(Integer currentHp) { this.currentHp = currentHp; }

    public Boolean getIsDefeated() { return isDefeated; }
    public void setIsDefeated(Boolean isDefeated) { this.isDefeated = isDefeated; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

    public Integer getGoldReward() { return goldReward; }
    public void setGoldReward(Integer goldReward) { this.goldReward = goldReward; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
