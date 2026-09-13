package com.liferpg.dto;

public class CharacterDTO {

    private Long id;
    private Long userId;
    private String username;
    private String avatar;
    private String className;
    private Integer level;
    private Long xp;
    private Long nextLevelXp;
    private Long gold;
    private Integer streak;
    private Integer strength;
    private Integer intelligence;
    private Integer discipline;
    private Integer creativity;
    private Integer confidence;
    private String equippedTheme;
    private String equippedFrame;
    private String companionName;

    // Alias / derived fields expected by the frontend
    private Long currentXp;          // same as xp (XP within current level)
    private Long totalXp;            // cumulative lifetime XP (same as xp for now)
    private String dnaClass;         // alias for className
    private Integer currentStreak;   // alias for streak
    private Integer intellect;       // alias for intelligence
    private Integer vitality;        // maps to confidence (closest stat)
    private Integer charisma;        // maps to confidence (closest stat)
    private Integer totalQuestsCompleted; // filled by service

    public CharacterDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public Long getXp() { return xp; }
    public void setXp(Long xp) { this.xp = xp; }

    public Long getNextLevelXp() { return nextLevelXp; }
    public void setNextLevelXp(Long nextLevelXp) { this.nextLevelXp = nextLevelXp; }

    public Long getGold() { return gold; }
    public void setGold(Long gold) { this.gold = gold; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

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

    // Alias getters/setters
    public Long getCurrentXp() { return currentXp; }
    public void setCurrentXp(Long currentXp) { this.currentXp = currentXp; }

    public Long getTotalXp() { return totalXp; }
    public void setTotalXp(Long totalXp) { this.totalXp = totalXp; }

    public String getDnaClass() { return dnaClass; }
    public void setDnaClass(String dnaClass) { this.dnaClass = dnaClass; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public Integer getIntellect() { return intellect; }
    public void setIntellect(Integer intellect) { this.intellect = intellect; }

    public Integer getVitality() { return vitality; }
    public void setVitality(Integer vitality) { this.vitality = vitality; }

    public Integer getCharisma() { return charisma; }
    public void setCharisma(Integer charisma) { this.charisma = charisma; }

    public Integer getTotalQuestsCompleted() { return totalQuestsCompleted; }
    public void setTotalQuestsCompleted(Integer totalQuestsCompleted) { this.totalQuestsCompleted = totalQuestsCompleted; }
}
