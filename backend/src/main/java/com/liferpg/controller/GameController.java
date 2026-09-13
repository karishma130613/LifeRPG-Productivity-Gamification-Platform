package com.liferpg.controller;

import com.liferpg.dto.*;
import com.liferpg.entity.GameSession;
import com.liferpg.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameInfoDTO>> getGames(Authentication authentication) {
        return ResponseEntity.ok(gameService.getAvailableGames(authentication.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<UserGameStatsDTO> getGameStats(Authentication authentication) {
        return ResponseEntity.ok(gameService.getUserStats(authentication.getName()));
    }

    @GetMapping("/daily-challenge")
    public ResponseEntity<DailyChallengeDTO> getDailyChallenge(Authentication authentication) {
        return ResponseEntity.ok(gameService.getDailyChallenge(authentication.getName()));
    }

    @PostMapping("/daily-challenge/claim")
    public ResponseEntity<GameResultDTO> claimDailyChallenge(Authentication authentication) {
        return ResponseEntity.ok(gameService.claimDailyChallenge(authentication.getName()));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<GameLeaderboardEntryDTO>> getLeaderboard() {
        return ResponseEntity.ok(gameService.getLeaderboard());
    }

    @GetMapping("/history")
    public ResponseEntity<List<GameSession>> getHistory(Authentication authentication) {
        return ResponseEntity.ok(gameService.getRecentHistory(authentication.getName()));
    }

    @PostMapping("/{gameId}/start")
    public ResponseEntity<GameSessionStartDTO> startGame(
            Authentication authentication,
            @PathVariable String gameId,
            @RequestBody(required = false) Map<String, Object> body) {
        String difficulty = body != null && body.containsKey("difficulty") ? (String) body.get("difficulty") : "MEDIUM";
        Long linkedQuestId = null;
        if (body != null && body.containsKey("linkedQuestId") && body.get("linkedQuestId") != null) {
            linkedQuestId = Long.valueOf(body.get("linkedQuestId").toString());
        }
        GameSessionStartDTO session = gameService.startGameSession(authentication.getName(), gameId, difficulty, linkedQuestId);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{gameId}/complete")
    public ResponseEntity<GameResultDTO> completeGame(
            Authentication authentication,
            @PathVariable String gameId,
            @RequestBody GameSessionCompleteRequest request) {
        GameResultDTO result = gameService.completeGameSession(authentication.getName(), gameId, request);
        return ResponseEntity.ok(result);
    }
}
