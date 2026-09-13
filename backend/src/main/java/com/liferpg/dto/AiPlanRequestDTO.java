package com.liferpg.dto;

import jakarta.validation.constraints.NotBlank;

public class AiPlanRequestDTO {

    @NotBlank(message = "Goal input prompt is required")
    private String goalPrompt;

    private String targetCategory = "Coding";

    public AiPlanRequestDTO() {
    }

    public String getGoalPrompt() { return goalPrompt; }
    public void setGoalPrompt(String goalPrompt) { this.goalPrompt = goalPrompt; }

    public String getTargetCategory() { return targetCategory; }
    public void setTargetCategory(String targetCategory) { this.targetCategory = targetCategory; }
}
