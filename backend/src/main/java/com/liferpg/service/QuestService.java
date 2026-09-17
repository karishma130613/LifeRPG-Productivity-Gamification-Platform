package com.liferpg.service;

import com.liferpg.dto.QuestDTO;
import com.liferpg.dto.QuestCompletionResultDTO;
import com.liferpg.entity.*;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestService {

    @Autowired
    private QuestRepository questRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterProfileRepository characterProfileRepository;

    @Autowired
    private CharacterService characterService;

    @Autowired
    private BossBattleRepository bossBattleRepository;

    @Autowired
    private WorldRegionRepository worldRegionRepository;

    @Autowired
    private UserWorldProgressRepository userWorldProgressRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private QuestNodeRepository questNodeRepository;

    @Lazy
    @Autowired
    private MainQuestService mainQuestService;

    @Transactional(readOnly = true)
    public List<QuestDTO> getUserQuests(String username, String category, String status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<Quest> quests;
        if (category != null && !category.isEmpty()) {
            quests = questRepository.findByUserIdAndCategory(user.getId(), category);
        } else if (status != null && !status.isEmpty()) {
            quests = questRepository.findByUserIdAndStatus(user.getId(), status);
        } else {
            quests = questRepository.findByUserId(user.getId());
        }

        return quests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public QuestDTO createQuest(String username, QuestDTO questDTO) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Quest quest = new Quest();
        quest.setUser(user);
        quest.setTitle(questDTO.getTitle());
        quest.setDescription(questDTO.getDescription());
        quest.setCategory(questDTO.getCategory() != null ? questDTO.getCategory() : "Study");
        quest.setDifficulty(questDTO.getDifficulty() != null ? questDTO.getDifficulty() : "MEDIUM");
        
        // Compute standard XP/Gold server-side based on difficulty
        int xp = calculateXpReward(quest.getDifficulty());
        int gold = calculateGoldReward(quest.getDifficulty());
        quest.setXpReward(xp);
        quest.setGoldReward(gold);

        quest.setDueDate(questDTO.getDueDate());
        quest.setPriority(questDTO.getPriority() != null ? questDTO.getPriority() : "MEDIUM");
        quest.setIsMainQuest(Boolean.TRUE.equals(questDTO.getIsMainQuest()));
        quest.setStatus("AVAILABLE");
        quest.setGameType(determineGameType(questDTO.getGameType(), quest.getCategory()));

        if (questDTO.getBossId() != null) {
            BossBattle boss = bossBattleRepository.findById(questDTO.getBossId()).orElse(null);
            quest.setBoss(boss);
        }

        Quest saved = questRepository.save(quest);
        return convertToDTO(saved);
    }

    @Transactional
    public QuestDTO updateQuest(String username, Long questId, QuestDTO questDTO) {
        Quest quest = getQuestAndVerifyOwnership(username, questId);
        
        if ("COMPLETED".equals(quest.getStatus())) {
            throw new BadRequestException("Cannot edit a completed quest!");
        }

        quest.setTitle(questDTO.getTitle());
        quest.setDescription(questDTO.getDescription());
        quest.setCategory(questDTO.getCategory());
        if (questDTO.getDifficulty() != null) {
            quest.setDifficulty(questDTO.getDifficulty());
            quest.setXpReward(calculateXpReward(quest.getDifficulty()));
            quest.setGoldReward(calculateGoldReward(quest.getDifficulty()));
        }
        if (questDTO.getGameType() != null) {
            quest.setGameType(questDTO.getGameType());
        }
        quest.setDueDate(questDTO.getDueDate());
        quest.setPriority(questDTO.getPriority());

        Quest updated = questRepository.save(quest);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteQuest(String username, Long questId) {
        Quest quest = getQuestAndVerifyOwnership(username, questId);
        questRepository.delete(quest);
    }

    @Transactional
    public QuestCompletionResultDTO completeQuest(String username, Long questId, String proofNotes, String proofUrl) {
        Quest quest = getQuestAndVerifyOwnership(username, questId);
        User user = quest.getUser();

        if ("COMPLETED".equals(quest.getStatus())) {
            throw new BadRequestException("Quest is already completed!");
        }

        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        // 1. Mark Quest as Completed
        quest.setStatus("COMPLETED");
        quest.setCompletedAt(LocalDateTime.now());
        if (proofNotes != null && !proofNotes.isEmpty()) quest.setProofNotes(proofNotes);
        if (proofUrl != null && !proofUrl.isEmpty()) quest.setProofUrl(proofUrl);
        questRepository.save(quest);

        // 1b. If this quest is part of a Main Quest chain, update progress and unlock next node
        if (Boolean.TRUE.equals(quest.getIsMainQuest())) {
            questNodeRepository.findByQuestId(quest.getId()).ifPresent(node -> {
                mainQuestService.updateMainQuestProgress(node.getMainQuest().getId());
            });
        }

        QuestCompletionResultDTO result = new QuestCompletionResultDTO();
        result.setXpGained(quest.getXpReward());
        result.setGoldGained(quest.getGoldReward());

        // 2. Attribute Boost based on Category
        String attrGained = boostAttributesByCategory(character, quest.getCategory());
        result.setAttributeGained(attrGained);
        result.setAttributeAmount(1);

        // 3. Update Streak & Active Date
        LocalDate today = LocalDate.now();
        int streakGained = 0;
        if (character.getLastActiveDate() == null) {
            character.setStreak(1);
            streakGained = 1;
        } else if (character.getLastActiveDate().equals(today.minusDays(1))) {
            character.setStreak(character.getStreak() + 1);
            streakGained = 1;
        } else if (!character.getLastActiveDate().equals(today)) {
            character.setStreak(1);
            streakGained = 1;
        }
        character.setLastActiveDate(today);
        result.setStreakGained(streakGained);

        // 4. Update XP & Gold
        long currentXp = character.getXp() + quest.getXpReward();
        long currentGold = character.getGold() + quest.getGoldReward();
        character.setXp(currentXp);
        character.setGold(currentGold);

        // 5. Level Up Check
        int oldLevel = character.getLevel();
        long xpNeeded = CharacterService.calculateXpForNextLevel(oldLevel);
        boolean leveledUp = false;
        if (currentXp >= xpNeeded) {
            character.setLevel(oldLevel + 1);
            leveledUp = true;
            
            // Bonus attribute point on Level Up!
            character.setDiscipline(character.getDiscipline() + 1);
            character.setIntelligence(character.getIntelligence() + 1);
        }
        result.setOldLevel(oldLevel);
        result.setNewLevel(character.getLevel());
        result.setLeveledUp(leveledUp);

        characterProfileRepository.save(character);

        // 6. Boss Battle Damage Check
        int bossDamage = 0;
        boolean bossDefeated = false;
        if (quest.getBoss() != null && !quest.getBoss().getIsDefeated()) {
            BossBattle boss = quest.getBoss();
            bossDamage = quest.getXpReward() * 2; // Damage proportional to XP
            int newHp = Math.max(0, boss.getCurrentHp() - bossDamage);
            boss.setCurrentHp(newHp);

            if (newHp == 0) {
                boss.setIsDefeated(true);
                bossDefeated = true;
                
                // Extra Boss Defeat Rewards!
                character.setXp(character.getXp() + boss.getXpReward());
                character.setGold(character.getGold() + boss.getGoldReward());
                characterProfileRepository.save(character);
            }
            bossBattleRepository.save(boss);
        }
        result.setBossDamageDealt(bossDamage);
        result.setBossDefeated(bossDefeated);

        // 7. Check World Region Unlocks
        List<String> unlockedRegions = checkAndUnlockWorldRegions(user, character.getLevel());
        result.setRegionsUnlocked(unlockedRegions);

        // 8. Check Achievements
        List<String> unlockedAchievements = checkAndUnlockAchievements(user, character);
        result.setAchievementsUnlocked(unlockedAchievements);

        result.setQuest(convertToDTO(quest));
        result.setUpdatedCharacter(characterService.convertToDTO(character));
        return result;
    }

    private String boostAttributesByCategory(CharacterProfile character, String category) {
        switch (category.toLowerCase()) {
            case "coding":
                character.setIntelligence(character.getIntelligence() + 1);
                return "Intelligence";
            case "study":
            case "reading":
                character.setIntelligence(character.getIntelligence() + 1);
                character.setDiscipline(character.getDiscipline() + 1);
                return "Intelligence & Discipline";
            case "fitness":
                character.setStrength(character.getStrength() + 1);
                return "Strength";
            case "creativity":
                character.setCreativity(character.getCreativity() + 1);
                return "Creativity";
            case "career":
                character.setConfidence(character.getConfidence() + 1);
                return "Confidence";
            default:
                character.setDiscipline(character.getDiscipline() + 1);
                return "Discipline";
        }
    }

    private List<String> checkAndUnlockWorldRegions(User user, int currentLevel) {
        List<String> newlyUnlocked = new ArrayList<>();
        List<WorldRegion> regions = worldRegionRepository.findAll();
        for (WorldRegion region : regions) {
            UserWorldProgress progress = userWorldProgressRepository.findByUserIdAndRegionId(user.getId(), region.getId())
                    .orElse(new UserWorldProgress(user, region, false));

            if (!progress.getIsUnlocked() && currentLevel >= region.getMinLevel()) {
                progress.setIsUnlocked(true);
                progress.setUnlockedAt(LocalDateTime.now());
                userWorldProgressRepository.save(progress);
                newlyUnlocked.add(region.getRegionName());
            }
        }
        return newlyUnlocked;
    }

    private List<String> checkAndUnlockAchievements(User user, CharacterProfile character) {
        List<String> newlyUnlocked = new ArrayList<>();
        long completedCount = questRepository.countCompletedByUserId(user.getId());

        List<Achievement> achievements = achievementRepository.findAll();
        for (Achievement ach : achievements) {
            if (!userAchievementRepository.existsByUserIdAndAchievementId(user.getId(), ach.getId())) {
                boolean met = false;
                switch (ach.getRequirementType()) {
                    case "QUESTS_COMPLETED":
                        met = completedCount >= ach.getRequirementValue();
                        break;
                    case "STREAK_DAYS":
                        met = character.getStreak() >= ach.getRequirementValue();
                        break;
                    case "LEVEL":
                        met = character.getLevel() >= ach.getRequirementValue();
                        break;
                    case "INTELLIGENCE":
                        met = character.getIntelligence() >= ach.getRequirementValue();
                        break;
                    case "STRENGTH":
                        met = character.getStrength() >= ach.getRequirementValue();
                        break;
                    case "GOLD_ACCUMULATED":
                        met = character.getGold() >= ach.getRequirementValue();
                        break;
                }

                if (met) {
                    UserAchievement ua = new UserAchievement(user, ach);
                    userAchievementRepository.save(ua);

                    // Add bonus rewards for unlocking achievement
                    character.setXp(character.getXp() + ach.getXpReward());
                    character.setGold(character.getGold() + ach.getGoldReward());
                    characterProfileRepository.save(character);

                    newlyUnlocked.add(ach.getName());
                }
            }
        }
        return newlyUnlocked;
    }

    private Quest getQuestAndVerifyOwnership(String username, Long questId) {
        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found with id: " + questId));
        if (!quest.getUser().getUsername().equals(username)) {
            throw new BadRequestException("Access denied: You do not own this quest");
        }
        return quest;
    }

    public static int calculateXpReward(String difficulty) {
        switch (difficulty.toUpperCase()) {
            case "EASY": return 30;
            case "MEDIUM": return 75;
            case "HARD": return 200;
            case "LEGENDARY": return 500;
            default: return 75;
        }
    }

    public static int calculateGoldReward(String difficulty) {
        switch (difficulty.toUpperCase()) {
            case "EASY": return 15;
            case "MEDIUM": return 35;
            case "HARD": return 90;
            case "LEGENDARY": return 250;
            default: return 35;
        }
    }

    public static String determineGameType(String gameType, String category) {
        if (gameType != null && !gameType.trim().isEmpty()) {
            return gameType.toUpperCase();
        }
        if (category == null) return "RHYTHM_SLASH";
        switch (category.toUpperCase()) {
            case "FITNESS":
                return "RHYTHM_SLASH";
            case "STUDY":
            case "READING":
            case "MIND":
                return "RUNE_MEMORY";
            case "CODING":
            case "CAREER":
                return "SPELL_TYPER";
            case "HABIT":
            case "VITALITY":
                return "ORB_DODGE";
            case "CREATIVITY":
            case "SOCIAL":
            case "PERSONAL":
            default:
                return "CONSTELLATION_AIM";
        }
    }

    public QuestDTO convertToDTO(Quest quest) {
        QuestDTO dto = new QuestDTO();
        dto.setId(quest.getId());
        dto.setUserId(quest.getUser().getId());
        dto.setTitle(quest.getTitle());
        dto.setDescription(quest.getDescription());
        dto.setCategory(quest.getCategory());
        dto.setDifficulty(quest.getDifficulty());
        dto.setXpReward(quest.getXpReward());
        dto.setGoldReward(quest.getGoldReward());
        dto.setDueDate(quest.getDueDate());
        dto.setPriority(quest.getPriority());
        dto.setIsMainQuest(quest.getIsMainQuest());
        dto.setStatus(quest.getStatus());
        dto.setGameType(quest.getGameType() != null ? quest.getGameType() : determineGameType(null, quest.getCategory()));
        dto.setProofUrl(quest.getProofUrl());
        dto.setProofNotes(quest.getProofNotes());
        if (quest.getBoss() != null) {
            dto.setBossId(quest.getBoss().getId());
        }
        dto.setCreatedAt(quest.getCreatedAt());
        dto.setCompletedAt(quest.getCompletedAt());
        return dto;
    }
}
