package com.liferpg.dto;

import java.util.List;

public class AiPlanResponseDTO {

    private String mainGoalTitle;
    private String category;
    private String description;
    private List<GeneratedQuestNodeDTO> generatedQuests;
    private Boolean isAiGenerated;

    public static class GeneratedQuestNodeDTO {
        private String title;
        private String description;
        private String category;
        private String difficulty;
        private Integer xpReward;
        private Integer goldReward;
        private Integer stepOrder;

        public GeneratedQuestNodeDTO() {}

        public GeneratedQuestNodeDTO(String title, String description, String category, String difficulty, Integer xpReward, Integer goldReward, Integer stepOrder) {
            this.title = title;
            this.description = description;
            this.category = category;
            this.difficulty = difficulty;
            this.xpReward = xpReward;
            this.goldReward = goldReward;
            this.stepOrder = stepOrder;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

        public Integer getXpReward() { return xpReward; }
        public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }

        public Integer getGoldReward() { return goldReward; }
        public void setGoldReward(Integer goldReward) { this.goldReward = goldReward; }

        public Integer getStepOrder() { return stepOrder; }
        public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
    }

    public AiPlanResponseDTO() {
    }

    public String getMainGoalTitle() { return mainGoalTitle; }
    public void setMainGoalTitle(String mainGoalTitle) { this.mainGoalTitle = mainGoalTitle; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<GeneratedQuestNodeDTO> getGeneratedQuests() { return generatedQuests; }
    public void setGeneratedQuests(List<GeneratedQuestNodeDTO> generatedQuests) { this.generatedQuests = generatedQuests; }

    public Boolean getIsAiGenerated() { return isAiGenerated; }
    public void setIsAiGenerated(Boolean isAiGenerated) { this.isAiGenerated = isAiGenerated; }
}
