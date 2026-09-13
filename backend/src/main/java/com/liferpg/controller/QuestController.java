package com.liferpg.controller;

import com.liferpg.dto.QuestCompletionResultDTO;
import com.liferpg.dto.QuestDTO;
import com.liferpg.service.QuestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    @Autowired
    private QuestService questService;

    @GetMapping
    public ResponseEntity<List<QuestDTO>> getQuests(
            Authentication authentication,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        List<QuestDTO> quests = questService.getUserQuests(authentication.getName(), category, status);
        return ResponseEntity.ok(quests);
    }

    @PostMapping
    public ResponseEntity<QuestDTO> createQuest(Authentication authentication, @Valid @RequestBody QuestDTO questDTO) {
        QuestDTO created = questService.createQuest(authentication.getName(), questDTO);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestDTO> updateQuest(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody QuestDTO questDTO) {
        QuestDTO updated = questService.updateQuest(authentication.getName(), id, questDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuest(Authentication authentication, @PathVariable Long id) {
        questService.deleteQuest(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<QuestCompletionResultDTO> completeQuest(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        String proofNotes = payload != null ? payload.get("proofNotes") : null;
        String proofUrl = payload != null ? payload.get("proofUrl") : null;
        QuestCompletionResultDTO result = questService.completeQuest(authentication.getName(), id, proofNotes, proofUrl);
        return ResponseEntity.ok(result);
    }
}
