package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_world_progress")
public class UserWorldProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private WorldRegion region;

    @Column(name = "is_unlocked")
    private Boolean isUnlocked = false;

    @Column(name = "unlocked_at")
    private LocalDateTime unlockedAt;

    public UserWorldProgress() {
    }

    public UserWorldProgress(User user, WorldRegion region, Boolean isUnlocked) {
        this.user = user;
        this.region = region;
        this.isUnlocked = isUnlocked;
        if (isUnlocked) {
            this.unlockedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public WorldRegion getRegion() { return region; }
    public void setRegion(WorldRegion region) { this.region = region; }

    public Boolean getIsUnlocked() { return isUnlocked; }
    public void setIsUnlocked(Boolean isUnlocked) { this.isUnlocked = isUnlocked; }

    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
}
