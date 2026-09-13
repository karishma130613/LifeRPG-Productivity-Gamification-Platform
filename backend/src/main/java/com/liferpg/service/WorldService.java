package com.liferpg.service;

import com.liferpg.dto.WorldRegionDTO;
import com.liferpg.entity.CharacterProfile;
import com.liferpg.entity.User;
import com.liferpg.entity.UserWorldProgress;
import com.liferpg.entity.WorldRegion;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.CharacterProfileRepository;
import com.liferpg.repository.UserRepository;
import com.liferpg.repository.UserWorldProgressRepository;
import com.liferpg.repository.WorldRegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorldService {

    @Autowired
    private WorldRegionRepository worldRegionRepository;

    @Autowired
    private UserWorldProgressRepository userWorldProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterProfileRepository characterProfileRepository;

    @Transactional(readOnly = true)
    public List<WorldRegionDTO> getUserWorldRegions(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found"));

        List<WorldRegion> regions = worldRegionRepository.findAll();
        List<WorldRegionDTO> dtos = new ArrayList<>();

        for (WorldRegion region : regions) {
            UserWorldProgress progress = userWorldProgressRepository.findByUserIdAndRegionId(user.getId(), region.getId())
                    .orElse(null);

            boolean isUnlocked = (progress != null && progress.getIsUnlocked()) || character.getLevel() >= region.getMinLevel();

            WorldRegionDTO dto = new WorldRegionDTO();
            dto.setId(region.getId());
            dto.setRegionName(region.getRegionName());
            dto.setDescription(region.getDescription());
            dto.setMinLevel(region.getMinLevel());
            dto.setCategory(region.getCategory());
            dto.setThemeColor(region.getThemeColor());
            dto.setIconName(region.getIconName());
            dto.setIsUnlocked(isUnlocked);
            dto.setUnlockedAt(progress != null ? progress.getUnlockedAt() : null);
            dtos.add(dto);
        }

        return dtos;
    }
}
