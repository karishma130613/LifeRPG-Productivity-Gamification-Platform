package com.liferpg.service;

import com.liferpg.dto.AiPlanRequestDTO;
import com.liferpg.dto.AiPlanResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AiPlannerService {

    @Value("${ai.api-key:}")
    private String apiKey;

    public AiPlanResponseDTO generateQuestPlan(AiPlanRequestDTO request) {
        String prompt = request.getGoalPrompt().toLowerCase();
        String category = request.getTargetCategory() != null ? request.getTargetCategory() : "Study";

        // Fallback intelligent goal breakdown templates
        AiPlanResponseDTO response = new AiPlanResponseDTO();
        response.setCategory(category);

        List<AiPlanResponseDTO.GeneratedQuestNodeDTO> quests = new ArrayList<>();

        if (prompt.contains("python") || prompt.contains("code") || prompt.contains("java") || prompt.contains("web")) {
            response.setMainGoalTitle("Mastery Journey: " + capitalize(request.getGoalPrompt()));
            response.setDescription("A structured technical learning roadmap to take you from foundational syntax to building production software.");
            response.setIsAiGenerated(false); // Honest label as requested by guidelines

            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Fundamentals & Syntax", "Understand data types, variables, and control structures", "Coding", "EASY", 30, 15, 1));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Functions & Modular Design", "Master reusable functions, scope, and clean code principles", "Coding", "MEDIUM", 75, 35, 2));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Object-Oriented Programming", "Implement classes, inheritance, and encapsulation", "Coding", "MEDIUM", 75, 35, 3));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Data Structures & Algorithms", "Solve fundamental arrays, lists, maps, and search problems", "Coding", "HARD", 200, 90, 4));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Capstone Project Construction", "Build and publish a real-world working application", "Coding", "LEGENDARY", 500, 250, 5));
        } else if (prompt.contains("fit") || prompt.contains("run") || prompt.contains("gym") || prompt.contains("workout")) {
            response.setMainGoalTitle("Physical Conditioning: " + capitalize(request.getGoalPrompt()));
            response.setDescription("A disciplined physical routine to build strength, endurance, and consistency.");
            response.setIsAiGenerated(false);

            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Form & Mobility Routine", "15-minute daily mobility stretching and posture alignment", "Fitness", "EASY", 30, 15, 1));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Core Strength Training", "30-minute bodyweight or weightlifting circuit", "Fitness", "MEDIUM", 75, 35, 2));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Cardiovascular Conditioning", "2-mile run or high-intensity interval cardio session", "Fitness", "MEDIUM", 75, 35, 3));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Nutrition & Hydration Audit", "Track macros and hit daily water intake targets", "Fitness", "EASY", 30, 15, 4));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Personal Record Challenge", "Push for a new PR milestone in your main exercise", "Fitness", "HARD", 200, 90, 5));
        } else {
            response.setMainGoalTitle("Quest Blueprint: " + capitalize(request.getGoalPrompt()));
            response.setDescription("A step-by-step RPG progression plan designed to achieve your real-life goal.");
            response.setIsAiGenerated(false);

            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Initial Research & Setup", "Gather resources, outline requirements, and set environment", category, "EASY", 30, 15, 1));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Core Milestone Part 1", "Complete the primary foundational objective", category, "MEDIUM", 75, 35, 2));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Core Milestone Part 2", "Expand features and deepen mastery of key skills", category, "MEDIUM", 75, 35, 3));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Review & Optimization", "Refine, audit quality, and fix identified flaws", category, "HARD", 200, 90, 4));
            quests.add(new AiPlanResponseDTO.GeneratedQuestNodeDTO("Final Launch & Delivery", "Ship and celebrate your accomplishment!", category, "LEGENDARY", 500, 250, 5));
        }

        response.setGeneratedQuests(quests);
        return response;
    }

    private String capitalize(String text) {
        if (text == null || text.isEmpty()) return text;
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }
}
