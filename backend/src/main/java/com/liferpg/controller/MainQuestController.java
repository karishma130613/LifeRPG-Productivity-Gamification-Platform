package com.liferpg.controller;

import com.liferpg.dto.MainQuestDTO;
import com.liferpg.service.MainQuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/main-quests")
public class MainQuestController {

    @Autowired
    private MainQuestService mainQuestService;

    @GetMapping
    public ResponseEntity<List<MainQuestDTO>> getMainQuests(Authentication authentication) {
        List<MainQuestDTO> mainQuests = mainQuestService.getUserMainQuests(authentication.getName());
        return ResponseEntity.ok(mainQuests);
    }

    @PostMapping
    public ResponseEntity<MainQuestDTO> createMainQuest(
            Authentication authentication,
            @RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");
        String category = (String) payload.get("category");
        @SuppressWarnings("unchecked")
        List<String> nodes = (List<String>) payload.get("nodes");

        MainQuestDTO created = mainQuestService.createMainQuestWithNodes(authentication.getName(), title, description, category, nodes);
        return ResponseEntity.ok(created);
    }
}
