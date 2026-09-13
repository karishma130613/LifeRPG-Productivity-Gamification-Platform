package com.liferpg.service;

import com.liferpg.dto.CharacterDTO;
import com.liferpg.entity.CharacterProfile;
import com.liferpg.entity.User;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.CharacterProfileRepository;
import com.liferpg.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CharacterService {

    @Autowired
    private CharacterProfileRepository characterProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public CharacterDTO getCharacterByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character profile not found for user: " + username));

        return convertToDTO(character);
    }

    public static long calculateXpForNextLevel(int currentLevel) {
        return Math.round(100 * Math.pow(currentLevel, 1.5));
    }

    public static String calculateLifeDnaClass(int strength, int intel, int discipline, int creativity, int confidence) {
        int max = Math.max(strength, Math.max(intel, Math.max(discipline, Math.max(creativity, confidence))));
        if (max < 15) return "Novice Adventurer";

        if (intel == max && discipline >= max - 5) return "Scholar / Strategist";
        if (intel == max) return "Grand Scholar";
        if (creativity == max) return "Visionary Creator";
        if (strength == max && discipline >= max - 5) return "Iron Warrior";
        if (strength == max) return "Titan Defender";
        if (confidence == max) return "Charismatic Leader";
        if (discipline == max) return "Master Strategist";

        return "Versatile Adventurer";
    }

    public CharacterDTO convertToDTO(CharacterProfile character) {
        CharacterDTO dto = new CharacterDTO();
        dto.setId(character.getId());
        dto.setUserId(character.getUser().getId());
        dto.setUsername(character.getUser().getUsername());
        dto.setAvatar(character.getAvatar());

        // Dynamically compute class name based on attributes
        String dynamicClass = calculateLifeDnaClass(
                character.getStrength(),
                character.getIntelligence(),
                character.getDiscipline(),
                character.getCreativity(),
                character.getConfidence()
        );
        dto.setClassName(dynamicClass);

        dto.setLevel(character.getLevel());
        dto.setXp(character.getXp());
        dto.setNextLevelXp(calculateXpForNextLevel(character.getLevel()));
        dto.setGold(character.getGold());
        dto.setStreak(character.getStreak());
        dto.setStrength(character.getStrength());
        dto.setIntelligence(character.getIntelligence());
        dto.setDiscipline(character.getDiscipline());
        dto.setCreativity(character.getCreativity());
        dto.setConfidence(character.getConfidence());
        dto.setEquippedTheme(character.getEquippedTheme());
        dto.setEquippedFrame(character.getEquippedFrame());
        dto.setCompanionName(character.getCompanionName());

        // Alias / derived fields for frontend compatibility
        dto.setCurrentXp(character.getXp());
        dto.setTotalXp(character.getXp());
        dto.setDnaClass(dynamicClass);
        dto.setCurrentStreak(character.getStreak());
        dto.setIntellect(character.getIntelligence());
        dto.setVitality(character.getConfidence());   // Confidence is closest to vitality
        dto.setCharisma(character.getConfidence());   // Confidence is closest to charisma
        return dto;
    }
}
