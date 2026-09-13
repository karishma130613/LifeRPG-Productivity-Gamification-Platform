package com.liferpg.service;

import com.liferpg.dto.*;
import com.liferpg.entity.*;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterProfileRepository characterProfileRepository;

    @Autowired
    private CharacterService characterService;

    @Autowired
    private BossBattleRepository bossBattleRepository;

    @Autowired
    private QuestRepository questRepository;

    @Autowired
    private QuestService questService;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private GameSessionRepository gameSessionRepository;

    @Autowired
    private GameStatsRepository gameStatsRepository;

    @Autowired
    private DailyGameChallengeRepository dailyGameChallengeRepository;

    // Static registry of all official mini-games in the Realm
    private static final Map<String, GameDefinition> GAME_REGISTRY = new LinkedHashMap<>();

    static class GameDefinition {
        String id;
        String name;
        String description;
        String category;
        String zoneName;
        int requiredLevel;
        String estimatedTime;
        String iconName;
        String attributeType;
        int baseHpDamage;
        List<String> difficulties;

        GameDefinition(String id, String name, String description, String category, String zoneName,
                       int requiredLevel, String estimatedTime, String iconName, String attributeType,
                       int baseHpDamage, List<String> difficulties) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.category = category;
            this.zoneName = zoneName;
            this.requiredLevel = requiredLevel;
            this.estimatedTime = estimatedTime;
            this.iconName = iconName;
            this.attributeType = attributeType;
            this.baseHpDamage = baseHpDamage;
            this.difficulties = difficulties;
        }
    }

    static {
        GAME_REGISTRY.put("memory-stars", new GameDefinition(
                "memory-stars", "Memory Stars", "Match cosmic rune cards in a celestial grid to test memory and recall.",
                "Intellect", "Star Meadow", 1, "2–3 min", "Sparkles", "Intellect", 40,
                Arrays.asList("EASY", "MEDIUM", "HARD")
        ));
        GAME_REGISTRY.put("mind-maze", new GameDefinition(
                "mind-maze", "Mind Maze", "Solve non-repetitive logic, number patterns, and sequence deductions.",
                "Intellect", "Star Meadow", 1, "2–4 min", "Brain", "Intellect", 40,
                Arrays.asList("EASY", "MEDIUM", "HARD", "EPIC")
        ));
        GAME_REGISTRY.put("number-forge", new GameDefinition(
                "number-forge", "Number Forge", "Fast mental arithmetic & numerical equations under time pressure.",
                "Intellect", "Crystal Library", 2, "2–3 min", "Binary", "Intellect", 50,
                Arrays.asList("EASY", "MEDIUM", "HARD")
        ));
        GAME_REGISTRY.put("word-quest", new GameDefinition(
                "word-quest", "Word Quest", "Unscramble runes, find missing letters, and master fantasy vocabulary.",
                "Creativity", "Crystal Library", 3, "2–4 min", "BookOpen", "Creativity", 50,
                Arrays.asList("EASY", "MEDIUM", "HARD")
        ));
        GAME_REGISTRY.put("focus-strike", new GameDefinition(
                "focus-strike", "Focus Strike", "Rapid-fire reflex training. Hit pulsing targets and build combo streaks.",
                "Discipline", "Focus Arena", 5, "1–3 min", "Target", "Discipline", 60,
                Arrays.asList("EASY", "MEDIUM", "HARD", "EPIC")
        ));
        GAME_REGISTRY.put("star-catcher", new GameDefinition(
                "star-catcher", "Star Catcher", "Steer the celestial spirit shield to harvest falling stars and dodge dark meteors.",
                "Vitality", "Focus Arena", 5, "2–3 min", "Shield", "Vitality", 60,
                Arrays.asList("EASY", "MEDIUM", "HARD")
        ));
    }

    @Transactional(readOnly = true)
    public List<GameInfoDTO> getAvailableGames(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        int playerLevel = character.getLevel();
        List<GameStats> userStats = gameStatsRepository.findByUserId(user.getId());
        Map<String, Integer> bestScores = userStats.stream()
                .collect(Collectors.toMap(GameStats::getGameId, GameStats::getBestScore, (a, b) -> Math.max(a, b)));

        List<GameInfoDTO> list = new ArrayList<>();
        for (GameDefinition def : GAME_REGISTRY.values()) {
            boolean isUnlocked = playerLevel >= def.requiredLevel;
            int bestScore = bestScores.getOrDefault(def.id, 0);
            list.add(new GameInfoDTO(
                    def.id, def.name, def.description, def.category, def.zoneName,
                    def.requiredLevel, isUnlocked, def.estimatedTime, def.iconName,
                    def.attributeType, def.baseHpDamage, bestScore, def.difficulties
            ));
        }
        return list;
    }

    @Transactional
    public GameSessionStartDTO startGameSession(String username, String gameId, String difficulty, Long linkedQuestId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        GameDefinition def = GAME_REGISTRY.get(gameId);
        if (def == null) {
            throw new BadRequestException("Unknown game: " + gameId);
        }

        if (character.getLevel() < def.requiredLevel) {
            throw new BadRequestException("Game locked! Requires Level " + def.requiredLevel);
        }

        String validDiff = (difficulty != null && def.difficulties.contains(difficulty.toUpperCase()))
                ? difficulty.toUpperCase() : "MEDIUM";

        String sessionId = UUID.randomUUID().toString();
        GameSession session = new GameSession(sessionId, user, gameId, validDiff, linkedQuestId);
        gameSessionRepository.save(session);

        return new GameSessionStartDTO(sessionId, gameId, validDiff, session.getStartedAt(), linkedQuestId);
    }

    @Transactional
    public GameResultDTO completeGameSession(String username, String gameId, GameSessionCompleteRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        GameSession session = gameSessionRepository.findByIdAndUserId(req.getSessionId(), user.getId())
                .orElseThrow(() -> new BadRequestException("Invalid or expired game session"));

        if (!"ACTIVE".equals(session.getStatus())) {
            throw new BadRequestException("Game session already completed or abandoned");
        }

        if (!session.getGameId().equals(gameId)) {
            throw new BadRequestException("Session does not match game ID");
        }

        LocalDateTime now = LocalDateTime.now();
        Duration elapsed = Duration.between(session.getStartedAt(), now);
        if (elapsed.getSeconds() < 2) {
            throw new BadRequestException("Invalid completion speed detected");
        }

        session.setStatus("COMPLETED");
        session.setCompletedAt(now);
        session.setScore(req.getScore());
        session.setAccuracy(req.getAccuracy());
        gameSessionRepository.save(session);

        GameResultDTO result = new GameResultDTO();
        result.setSuccess(true);
        result.setScore(req.getScore());
        result.setAccuracy(req.getAccuracy());

        // 1. Authoritative XP and Gold based on difficulty
        int baseXP = 75;
        int baseGold = 30;
        int bossDamage = 50;
        String diff = session.getDifficulty().toUpperCase();
        switch (diff) {
            case "EASY":
                baseXP = 50;
                baseGold = 20;
                bossDamage = 30;
                break;
            case "MEDIUM":
                baseXP = 75;
                baseGold = 30;
                bossDamage = 50;
                break;
            case "HARD":
                baseXP = 100;
                baseGold = 50;
                bossDamage = 75;
                break;
            case "EPIC":
                baseXP = 150;
                baseGold = 75;
                bossDamage = 100;
                break;
        }

        // Accuracy / performance bonus
        if (req.getAccuracy() >= 90.0) {
            baseXP = (int) Math.round(baseXP * 1.2);
            baseGold += 10;
        }

        result.setXpEarned(baseXP);
        result.setGoldEarned(baseGold);

        // 2. Life DNA Attribute Enhancement
        String boostedAttr = boostAttributeByGame(character, gameId);
        result.setAttributeBoosted(boostedAttr);

        // 3. Update Player XP & Gold & Level Up Check
        long updatedXp = character.getXp() + baseXP;
        long updatedGold = character.getGold() + baseGold;
        character.setXp(updatedXp);
        character.setGold(updatedGold);

        int oldLevel = character.getLevel();
        long xpNeeded = CharacterService.calculateXpForNextLevel(oldLevel);
        boolean leveledUp = false;
        if (updatedXp >= xpNeeded) {
            character.setLevel(oldLevel + 1);
            leveledUp = true;
            character.setDiscipline(character.getDiscipline() + 1);
        }
        result.setLeveledUp(leveledUp);
        result.setNewLevel(character.getLevel());
        characterProfileRepository.save(character);

        // 4. Boss Battle Damage Check
        List<BossBattle> bosses = bossBattleRepository.findByUserId(user.getId());
        BossBattle activeBoss = bosses.stream().filter(b -> !b.getIsDefeated()).findFirst().orElse(null);
        if (activeBoss != null) {
            int newHp = Math.max(0, activeBoss.getCurrentHp() - bossDamage);
            activeBoss.setCurrentHp(newHp);
            result.setBossDamageDealt(bossDamage);
            result.setBossName(activeBoss.getName());

            if (newHp == 0) {
                activeBoss.setIsDefeated(true);
                result.setBossDefeated(true);
                character.setXp(character.getXp() + activeBoss.getXpReward());
                character.setGold(character.getGold() + activeBoss.getGoldReward());
                characterProfileRepository.save(character);
            }
            bossBattleRepository.save(activeBoss);
            result.setRemainingBossHp(newHp);
        } else {
            result.setBossDamageDealt(bossDamage);
            result.setBossDefeated(false);
        }

        // 5. Update Game Statistics & Daily Streak
        LocalDate today = LocalDate.now();
        GameStats stats = gameStatsRepository.findByUserIdAndGameId(user.getId(), gameId)
                .orElse(new GameStats(user, gameId));

        stats.setGamesPlayed(stats.getGamesPlayed() + 1);
        if (req.isWon()) {
            stats.setGamesWon(stats.getGamesWon() + 1);
        }
        stats.setBestScore(Math.max(stats.getBestScore(), req.getScore()));
        stats.setTotalXpEarned(stats.getTotalXpEarned() + baseXP);
        stats.setTotalGoldEarned(stats.getTotalGoldEarned() + baseGold);

        // Streak check
        int streakBonusGold = 0;
        if (stats.getLastPlayedDate() == null) {
            stats.setCurrentStreak(1);
        } else if (stats.getLastPlayedDate().equals(today.minusDays(1))) {
            stats.setCurrentStreak(stats.getCurrentStreak() + 1);
        } else if (!stats.getLastPlayedDate().equals(today)) {
            stats.setCurrentStreak(1);
        }
        stats.setLongestStreak(Math.max(stats.getLongestStreak(), stats.getCurrentStreak()));
        stats.setLastPlayedDate(today);

        // Streak milestone rewards
        if (stats.getCurrentStreak() == 3) streakBonusGold = 30;
        else if (stats.getCurrentStreak() == 7) streakBonusGold = 100;
        else if (stats.getCurrentStreak() == 14) streakBonusGold = 250;
        else if (stats.getCurrentStreak() == 30) streakBonusGold = 750;

        if (streakBonusGold > 0) {
            character.setGold(character.getGold() + streakBonusGold);
            characterProfileRepository.save(character);
        }

        gameStatsRepository.save(stats);
        result.setCurrentStreak(stats.getCurrentStreak());
        result.setStreakBonusGold(streakBonusGold);

        // 6. Update Daily Game Challenge Progress (e.g. 0/2 -> 1/2)
        DailyGameChallenge dailyChallenge = dailyGameChallengeRepository
                .findByUserIdAndChallengeDate(user.getId(), today)
                .orElse(new DailyGameChallenge(user, today));

        dailyChallenge.setCompletedCount(dailyChallenge.getCompletedCount() + 1);
        dailyGameChallengeRepository.save(dailyChallenge);

        result.setDailyChallengeCompleted(dailyChallenge.getCompletedCount());
        result.setDailyChallengeTarget(dailyChallenge.getTargetCount());
        result.setDailyChallengeReadyToClaim(dailyChallenge.getCompletedCount() >= dailyChallenge.getTargetCount() && !dailyChallenge.isClaimed());

        // 7. Linked Quest Completion Check
        if (session.getLinkedQuestId() != null) {
            try {
                questService.completeQuest(username, session.getLinkedQuestId(), "Completed via " + gameId, null);
            } catch (Exception e) {
                // If already completed or not found, proceed smoothly
            }
        }

        // 8. Achievements Check
        List<String> unlockedAchievements = checkGameAchievements(user, character);
        result.setAchievementsUnlocked(unlockedAchievements);

        result.setUpdatedCharacter(characterService.convertToDTO(character));
        result.setMessage("Mini-game conquered! Starlight rewards harvested.");
        return result;
    }

    private String boostAttributeByGame(CharacterProfile character, String gameId) {
        switch (gameId) {
            case "memory-stars":
            case "mind-maze":
            case "number-forge":
                character.setIntelligence(character.getIntelligence() + 1);
                return "Intellect +1";
            case "focus-strike":
                character.setDiscipline(character.getDiscipline() + 1);
                return "Discipline +1";
            case "star-catcher":
                character.setStrength(character.getStrength() + 1);
                return "Vitality +1";
            case "word-quest":
                character.setCreativity(character.getCreativity() + 1);
                return "Creativity +1";
            default:
                character.setConfidence(character.getConfidence() + 1);
                return "Confidence +1";
        }
    }

    @Transactional
    public DailyChallengeDTO getDailyChallenge(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        LocalDate today = LocalDate.now();
        DailyGameChallenge challenge = dailyGameChallengeRepository
                .findByUserIdAndChallengeDate(user.getId(), today)
                .orElse(new DailyGameChallenge(user, today));

        DailyChallengeDTO dto = new DailyChallengeDTO();
        dto.setDate(today.toString());
        dto.setTargetCount(challenge.getTargetCount());
        dto.setCompletedCount(challenge.getCompletedCount());
        dto.setClaimed(challenge.isClaimed());
        dto.setReadyToClaim(challenge.getCompletedCount() >= challenge.getTargetCount() && !challenge.isClaimed());
        return dto;
    }

    @Transactional
    public GameResultDTO claimDailyChallenge(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        LocalDate today = LocalDate.now();
        DailyGameChallenge challenge = dailyGameChallengeRepository
                .findByUserIdAndChallengeDate(user.getId(), today)
                .orElseThrow(() -> new BadRequestException("No daily challenge found for today"));

        if (challenge.isClaimed()) {
            throw new BadRequestException("Daily challenge reward already claimed today!");
        }

        if (challenge.getCompletedCount() < challenge.getTargetCount()) {
            throw new BadRequestException("Daily challenge not completed yet (" + challenge.getCompletedCount() + "/" + challenge.getTargetCount() + ")");
        }

        challenge.setIsClaimed(true);
        challenge.setClaimedAt(LocalDateTime.now());
        dailyGameChallengeRepository.save(challenge);

        int xpReward = 150;
        int goldReward = 75;
        character.setXp(character.getXp() + xpReward);
        character.setGold(character.getGold() + goldReward);
        characterProfileRepository.save(character);

        GameResultDTO result = new GameResultDTO();
        result.setSuccess(true);
        result.setXpEarned(xpReward);
        result.setGoldEarned(goldReward);
        result.setMessage("Daily Game Challenge Claimed! +150 XP, +75 Gold");
        result.setUpdatedCharacter(characterService.convertToDTO(character));
        return result;
    }

    @Transactional(readOnly = true)
    public UserGameStatsDTO getUserStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<GameStats> statsList = gameStatsRepository.findByUserId(user.getId());

        UserGameStatsDTO dto = new UserGameStatsDTO();
        int totalPlayed = 0;
        int totalWon = 0;
        int currentStreak = 0;
        int longestStreak = 0;
        long totalXp = 0;
        long totalGold = 0;
        int bestScore = 0;
        Map<String, Integer> bestByGame = new HashMap<>();

        for (GameStats s : statsList) {
            totalPlayed += s.getGamesPlayed();
            totalWon += s.getGamesWon();
            currentStreak = Math.max(currentStreak, s.getCurrentStreak());
            longestStreak = Math.max(longestStreak, s.getLongestStreak());
            totalXp += s.getTotalXpEarned();
            totalGold += s.getTotalGoldEarned();
            bestScore = Math.max(bestScore, s.getBestScore());
            bestByGame.put(s.getGameId(), s.getBestScore());
        }

        dto.setTotalGamesPlayed(totalPlayed);
        dto.setTotalGamesWon(totalWon);
        dto.setCurrentStreak(currentStreak);
        dto.setLongestStreak(longestStreak);
        dto.setTotalXpEarned(totalXp);
        dto.setTotalGoldEarned(totalGold);
        dto.setOverallBestScore(bestScore);
        dto.setOverallAccuracy(totalPlayed > 0 ? Math.round((double) totalWon / totalPlayed * 100) : 0);
        dto.setBestScoreByGame(bestByGame);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<GameSession> getRecentHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return gameSessionRepository.findTop10ByUserIdAndStatusOrderByCompletedAtDesc(user.getId(), "COMPLETED");
    }

    @Transactional(readOnly = true)
    public List<GameLeaderboardEntryDTO> getLeaderboard() {
        // Collect top players from game stats
        List<GameStats> allStats = gameStatsRepository.findAll();
        allStats.sort((a, b) -> Integer.compare(b.getBestScore(), a.getBestScore()));

        List<GameLeaderboardEntryDTO> leaderboard = new ArrayList<>();
        int rank = 1;
        for (GameStats s : allStats.stream().limit(10).collect(Collectors.toList())) {
            User u = s.getUser();
            CharacterProfile cp = characterProfileRepository.findByUser(u).orElse(null);
            leaderboard.add(new GameLeaderboardEntryDTO(
                    rank++,
                    u.getUsername(),
                    cp != null ? cp.getAvatar() : "default",
                    cp != null ? cp.getClassName() : "Adventurer",
                    cp != null ? cp.getLevel() : 1,
                    s.getGameId(),
                    s.getBestScore(),
                    s.getGamesWon()
            ));
        }
        return leaderboard;
    }

    private List<String> checkGameAchievements(User user, CharacterProfile character) {
        List<String> unlocked = new ArrayList<>();
        List<GameStats> statsList = gameStatsRepository.findByUserId(user.getId());
        int totalWon = statsList.stream().mapToInt(GameStats::getGamesWon).sum();

        if (totalWon >= 1) {
            grantAchievement(user, "GAME_FIRST_WIN", unlocked);
        }
        if (totalWon >= 10) {
            grantAchievement(user, "GAME_ARCADE_10", unlocked);
        }
        return unlocked;
    }

    private void grantAchievement(User user, String code, List<String> unlocked) {
        achievementRepository.findByCode(code).ifPresent(ach -> {
            boolean already = userAchievementRepository.findByUserIdAndAchievementId(user.getId(), ach.getId()).isPresent();
            if (!already) {
                userAchievementRepository.save(new UserAchievement(user, ach));
                unlocked.add(ach.getName());
            }
        });
    }
}
