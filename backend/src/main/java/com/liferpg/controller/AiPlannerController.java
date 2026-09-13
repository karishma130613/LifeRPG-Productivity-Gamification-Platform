package com.liferpg.controller;

import com.liferpg.dto.AiPlanRequestDTO;
import com.liferpg.dto.AiPlanResponseDTO;
import com.liferpg.service.AiPlannerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiPlannerController {

    @Autowired
    private AiPlannerService aiPlannerService;

    @PostMapping("/plan")
    public ResponseEntity<AiPlanResponseDTO> generatePlan(@Valid @RequestBody AiPlanRequestDTO request) {
        AiPlanResponseDTO plan = aiPlannerService.generateQuestPlan(request);
        return ResponseEntity.ok(plan);
    }
}
