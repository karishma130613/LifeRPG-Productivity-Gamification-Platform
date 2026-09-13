package com.liferpg.service;

import com.liferpg.dto.BossBattleDTO;
import com.liferpg.entity.BossBattle;
import com.liferpg.entity.User;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.BossBattleRepository;
import com.liferpg.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BossService {

    @Autowired
    private BossBattleRepository bossBattleRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BossBattleDTO> getUserBossBattles(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<BossBattle> bosses = bossBattleRepository.findByUserId(user.getId());
        if (bosses.isEmpty()) {
            // Seed a default starter Boss Battle for new users!
            BossBattle starterBoss = new BossBattle();
            starterBoss.setUser(user);
            starterBoss.setName("The Semester Exam Titan");
            starterBoss.setTitle("Master of Midterms");
            starterBoss.setDescription("A colossal exam monster powered by procrastination. Complete study quests to strike damage!");
            starterBoss.setCategory("Study");
            starterBoss.setMaxHp(1000);
            starterBoss.setCurrentHp(1000);
            starterBoss.setIsDefeated(false);
            starterBoss.setXpReward(500);
            starterBoss.setGoldReward(250);
            starterBoss.setIconName("boss_exam");
            bosses.add(bossBattleRepository.save(starterBoss));
        }

        return bosses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public BossBattleDTO createBossBattle(String username, BossBattleDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BossBattle boss = new BossBattle();
        boss.setUser(user);
        boss.setName(dto.getName());
        boss.setTitle(dto.getTitle());
        boss.setDescription(dto.getDescription());
        boss.setCategory(dto.getCategory() != null ? dto.getCategory() : "Study");
        boss.setMaxHp(dto.getMaxHp() != null ? dto.getMaxHp() : 2000);
        boss.setCurrentHp(boss.getMaxHp());
        boss.setIsDefeated(false);
        boss.setXpReward(dto.getXpReward() != null ? dto.getXpReward() : 500);
        boss.setGoldReward(dto.getGoldReward() != null ? dto.getGoldReward() : 250);
        boss.setIconName(dto.getIconName() != null ? dto.getIconName() : "boss_default");

        BossBattle saved = bossBattleRepository.save(boss);
        return convertToDTO(saved);
    }

    public BossBattleDTO convertToDTO(BossBattle boss) {
        BossBattleDTO dto = new BossBattleDTO();
        dto.setId(boss.getId());
        dto.setUserId(boss.getUser().getId());
        dto.setName(boss.getName());
        dto.setTitle(boss.getTitle());
        dto.setDescription(boss.getDescription());
        dto.setCategory(boss.getCategory());
        dto.setMaxHp(boss.getMaxHp());
        dto.setCurrentHp(boss.getCurrentHp());
        dto.setIsDefeated(boss.getIsDefeated());
        dto.setXpReward(boss.getXpReward());
        dto.setGoldReward(boss.getGoldReward());
        dto.setIconName(boss.getIconName());
        return dto;
    }
}
