package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_daily_events")
public class UserDailyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "daily_event_id", nullable = false)
    private DailyEvent dailyEvent;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public UserDailyEvent() {
    }

    public UserDailyEvent(User user, DailyEvent dailyEvent, Boolean isCompleted) {
        this.user = user;
        this.dailyEvent = dailyEvent;
        this.isCompleted = isCompleted;
        if (isCompleted) {
            this.completedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public DailyEvent getDailyEvent() { return dailyEvent; }
    public void setDailyEvent(DailyEvent dailyEvent) { this.dailyEvent = dailyEvent; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
