package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "world_regions")
public class WorldRegion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "region_name", nullable = false, unique = true, length = 100)
    private String regionName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "min_level", nullable = false)
    private Integer minLevel;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "theme_color", length = 30)
    private String themeColor = "blue";

    @Column(name = "icon_name", length = 50)
    private String iconName = "base_icon";

    public WorldRegion() {
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
}
