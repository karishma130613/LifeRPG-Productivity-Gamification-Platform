package com.liferpg.controller;

import com.liferpg.dto.BossBattleDTO;
import com.liferpg.service.BossService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bosses")
public class BossController {

    @Autowired
    private BossService bossService;

    @GetMapping
    public ResponseEntity<List<BossBattleDTO>> getBosses(Authentication authentication) {
        List<BossBattleDTO> bosses = bossService.getUserBossBattles(authentication.getName());
        return ResponseEntity.ok(bosses);
    }

    @PostMapping
    public ResponseEntity<BossBattleDTO> createBoss(Authentication authentication, @RequestBody BossBattleDTO dto) {
        BossBattleDTO created = bossService.createBossBattle(authentication.getName(), dto);
        return ResponseEntity.ok(created);
    }
}
