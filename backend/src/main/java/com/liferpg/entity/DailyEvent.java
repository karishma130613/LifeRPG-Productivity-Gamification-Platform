package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_events")
public class DailyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "xp_bonus")
    private Integer xpBonus = 50;

    @Column(name = "gold_bonus")
    private Integer goldBonus = 25;

    @Column(name = "requirement_target")
    private Integer requirementTarget = 1;

    public DailyEvent() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getXpBonus() { return xpBonus; }
    public void setXpBonus(Integer xpBonus) { this.xpBonus = xpBonus; }

    public Integer getGoldBonus() { return goldBonus; }
    public void setGoldBonus(Integer goldBonus) { this.goldBonus = goldBonus; }

    public Integer getRequirementTarget() { return requirementTarget; }
    public void setRequirementTarget(Integer requirementTarget) { this.requirementTarget = requirementTarget; }
}
