package com.liferpg.dto;

import java.util.List;

public class MainQuestDTO {

    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String category;
    private Integer progressPercentage;
    private String status;
    private List<NodeDTO> nodes;

    public static class NodeDTO {
        private Long id;
        private Long mainQuestId;
        private Long questId;
        private String nodeName;
        private Long prerequisiteNodeId;
        private String status;
        private Integer stepOrder;

        public NodeDTO() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getMainQuestId() { return mainQuestId; }
        public void setMainQuestId(Long mainQuestId) { this.mainQuestId = mainQuestId; }

        public Long getQuestId() { return questId; }
        public void setQuestId(Long questId) { this.questId = questId; }

        public String getNodeName() { return nodeName; }
        public void setNodeName(String nodeName) { this.nodeName = nodeName; }

        public Long getPrerequisiteNodeId() { return prerequisiteNodeId; }
        public void setPrerequisiteNodeId(Long prerequisiteNodeId) { this.prerequisiteNodeId = prerequisiteNodeId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Integer getStepOrder() { return stepOrder; }
        public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
    }

    public MainQuestDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(Integer progressPercentage) { this.progressPercentage = progressPercentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<NodeDTO> getNodes() { return nodes; }
    public void setNodes(List<NodeDTO> nodes) { this.nodes = nodes; }
}
