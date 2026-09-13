package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "boss_battles")
public class BossBattle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(name = "max_hp", nullable = false)
    private Integer maxHp;

    @Column(name = "current_hp", nullable = false)
    private Integer currentHp;

    @Column(name = "is_defeated")
    private Boolean isDefeated = false;

    @Column(name = "xp_reward")
    private Integer xpReward = 500;

    @Column(name = "gold_reward")
    private Integer goldReward = 250;

    @Column(name = "icon_name")
    private String iconName = "boss_default";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public BossBattle() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
