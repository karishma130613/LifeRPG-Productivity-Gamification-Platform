package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_game_challenges", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "challenge_date"})
})
public class DailyGameChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "challenge_date", nullable = false)
    private LocalDate challengeDate;

    @Column(name = "target_count", nullable = false)
    private int targetCount = 2;

    @Column(name = "completed_count", nullable = false)
    private int completedCount = 0;

    @Column(name = "is_claimed", nullable = false)
    private boolean isClaimed = false;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    public DailyGameChallenge() {}

    public DailyGameChallenge(User user, LocalDate challengeDate) {
        this.user = user;
        this.challengeDate = challengeDate;
        this.targetCount = 2;
        this.completedCount = 0;
        this.isClaimed = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getChallengeDate() { return challengeDate; }
    public void setChallengeDate(LocalDate challengeDate) { this.challengeDate = challengeDate; }

    public int getTargetCount() { return targetCount; }
    public void setTargetCount(int targetCount) { this.targetCount = targetCount; }

    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }

    public boolean getIsClaimed() { return isClaimed; }
    public boolean isClaimed() { return isClaimed; }
    public void setIsClaimed(boolean isClaimed) { this.isClaimed = isClaimed; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }
}
