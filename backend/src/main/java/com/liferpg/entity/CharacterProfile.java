package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "characters")
public class CharacterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String avatar = "default_starlight";

    @Column(name = "class_name")
    private String className = "Novice Adventurer";

    private Integer level = 1;
    private Long xp = 0L;
    private Long gold = 100L;
    private Integer streak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    private Integer strength = 10;
    private Integer intelligence = 10;
    private Integer discipline = 10;
    private Integer creativity = 10;
    private Integer confidence = 10;

    @Column(name = "equipped_theme")
    private String equippedTheme = "starlight";

    @Column(name = "equipped_frame")
    private String equippedFrame = "default";

    @Column(name = "companion_name")
    private String companionName = "Lumi";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CharacterProfile() {
    }

    public CharacterProfile(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Long getXp() { return xp; }
    public void setXp(Long xp) { this.xp = xp; }

    public Long getGold() { return gold; }
    public void setGold(Long gold) { this.gold = gold; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

    public LocalDate getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDate lastActiveDate) { this.lastActiveDate = lastActiveDate; }

    public Integer getStrength() { return strength; }
    public void setStrength(Integer strength) { this.strength = strength; }

    public Integer getIntelligence() { return intelligence; }
    public void setIntelligence(Integer intelligence) { this.intelligence = intelligence; }

    public Integer getDiscipline() { return discipline; }
    public void setDiscipline(Integer discipline) { this.discipline = discipline; }

    public Integer getCreativity() { return creativity; }
    public void setCreativity(Integer creativity) { this.creativity = creativity; }

    public Integer getConfidence() { return confidence; }
    public void setConfidence(Integer confidence) { this.confidence = confidence; }

    public String getEquippedTheme() { return equippedTheme; }
    public void setEquippedTheme(String equippedTheme) { this.equippedTheme = equippedTheme; }

    public String getEquippedFrame() { return equippedFrame; }
    public void setEquippedFrame(String equippedFrame) { this.equippedFrame = equippedFrame; }

    public String getCompanionName() { return companionName; }
    public void setCompanionName(String companionName) { this.companionName = companionName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
