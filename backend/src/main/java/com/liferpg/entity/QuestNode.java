package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "quest_nodes")
public class QuestNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_quest_id", nullable = false)
    private MainQuest mainQuest;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quest_id")
    private Quest quest;

    @Column(name = "node_name", nullable = false, length = 150)
    private String nodeName;

    @Column(name = "prerequisite_node_id")
    private Long prerequisiteNodeId;

    @Column(length = 20)
    private String status = "LOCKED"; // LOCKED, AVAILABLE, COMPLETED

    @Column(name = "step_order")
    private Integer stepOrder = 1;

    public QuestNode() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MainQuest getMainQuest() { return mainQuest; }
    public void setMainQuest(MainQuest mainQuest) { this.mainQuest = mainQuest; }

    public Quest getQuest() { return quest; }
    public void setQuest(Quest quest) { this.quest = quest; }

    public String getNodeName() { return nodeName; }
    public void setNodeName(String nodeName) { this.nodeName = nodeName; }

    public Long getPrerequisiteNodeId() { return prerequisiteNodeId; }
    public void setPrerequisiteNodeId(Long prerequisiteNodeId) { this.prerequisiteNodeId = prerequisiteNodeId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
}
