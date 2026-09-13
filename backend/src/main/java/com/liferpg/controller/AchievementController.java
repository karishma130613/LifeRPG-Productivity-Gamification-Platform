package com.liferpg.controller;

import com.liferpg.dto.AchievementDTO;
import com.liferpg.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @GetMapping
    public ResponseEntity<List<AchievementDTO>> getAchievements(Authentication authentication) {
        List<AchievementDTO> achievements = achievementService.getUserAchievements(authentication.getName());
        return ResponseEntity.ok(achievements);
    }
}
