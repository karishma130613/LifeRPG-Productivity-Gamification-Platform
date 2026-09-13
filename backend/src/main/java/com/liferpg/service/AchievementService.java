package com.liferpg.service;

import com.liferpg.dto.AchievementDTO;
import com.liferpg.entity.Achievement;
import com.liferpg.entity.User;
import com.liferpg.entity.UserAchievement;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.AchievementRepository;
import com.liferpg.repository.UserAchievementRepository;
import com.liferpg.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AchievementDTO> getUserAchievements(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Achievement> allAchievements = achievementRepository.findAll();
        List<UserAchievement> userAchievements = userAchievementRepository.findByUserId(user.getId());

        List<AchievementDTO> dtos = new ArrayList<>();
        for (Achievement ach : allAchievements) {
            UserAchievement ua = userAchievements.stream()
                    .filter(u -> u.getAchievement().getId().equals(ach.getId()))
                    .findFirst().orElse(null);

            AchievementDTO dto = new AchievementDTO();
            dto.setId(ach.getId());
            dto.setCode(ach.getCode());
            dto.setName(ach.getName());
            dto.setDescription(ach.getDescription());
            dto.setCategory(ach.getCategory());
            dto.setXpReward(ach.getXpReward());
            dto.setGoldReward(ach.getGoldReward());
            dto.setBadgeIcon(ach.getBadgeIcon());
            dto.setRequirementType(ach.getRequirementType());
            dto.setRequirementValue(ach.getRequirementValue());
            dto.setIsUnlocked(ua != null);
            dto.setUnlockedAt(ua != null ? ua.getUnlockedAt() : null);

            dtos.add(dto);
        }

        return dtos;
    }
}
