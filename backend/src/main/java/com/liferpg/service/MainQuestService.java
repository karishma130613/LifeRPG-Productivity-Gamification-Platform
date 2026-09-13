package com.liferpg.service;

import com.liferpg.dto.MainQuestDTO;
import com.liferpg.entity.*;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MainQuestService {

    @Autowired
    private MainQuestRepository mainQuestRepository;

    @Autowired
    private QuestNodeRepository questNodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestRepository questRepository;

    @Lazy
    @Autowired
    private QuestService questService;

    @Transactional(readOnly = true)
    public List<MainQuestDTO> getUserMainQuests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<MainQuest> mainQuests = mainQuestRepository.findByUserId(user.getId());
        return mainQuests.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public MainQuestDTO createMainQuestWithNodes(String username, String title, String description, String category, List<String> nodeNames) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MainQuest mainQuest = new MainQuest();
        mainQuest.setUser(user);
        mainQuest.setTitle(title);
        mainQuest.setDescription(description);
        mainQuest.setCategory(category != null ? category : "Study");
        mainQuest.setProgressPercentage(0);
        mainQuest.setStatus("IN_PROGRESS");

        MainQuest savedMainQuest = mainQuestRepository.save(mainQuest);

        List<QuestNode> nodes = new ArrayList<>();
        Long previousNodeId = null;

        for (int i = 0; i < nodeNames.size(); i++) {
            String name = nodeNames.get(i);

            // Create standard quest for this step
            Quest quest = new Quest();
            quest.setUser(user);
            quest.setTitle(name);
            quest.setDescription("Step " + (i + 1) + " of Main Goal: " + title);
            quest.setCategory(category != null ? category : "Study");
            quest.setDifficulty(i == nodeNames.size() - 1 ? "HARD" : "MEDIUM");
            quest.setXpReward(QuestService.calculateXpReward(quest.getDifficulty()));
            quest.setGoldReward(QuestService.calculateGoldReward(quest.getDifficulty()));
            quest.setIsMainQuest(true);
            quest.setStatus(i == 0 ? "AVAILABLE" : "LOCKED");
            quest.setGameType(QuestService.determineGameType(null, quest.getCategory()));
            Quest savedQuest = questRepository.save(quest);

            QuestNode node = new QuestNode();
            node.setMainQuest(savedMainQuest);
            node.setQuest(savedQuest);
            node.setNodeName(name);
            node.setStepOrder(i + 1);
            node.setPrerequisiteNodeId(previousNodeId);
            node.setStatus(i == 0 ? "AVAILABLE" : "LOCKED");

            QuestNode savedNode = questNodeRepository.save(node);
            previousNodeId = savedNode.getId();
            nodes.add(savedNode);
        }

        savedMainQuest.setNodes(nodes);
        return convertToDTO(savedMainQuest);
    }

    @Transactional
    public MainQuestDTO updateMainQuestProgress(Long mainQuestId) {
        MainQuest mainQuest = mainQuestRepository.findById(mainQuestId)
                .orElseThrow(() -> new ResourceNotFoundException("Main Quest not found"));

        List<QuestNode> nodes = questNodeRepository.findByMainQuestId(mainQuestId);
        long completedCount = nodes.stream().filter(n -> "COMPLETED".equals(n.getStatus()) || (n.getQuest() != null && "COMPLETED".equals(n.getQuest().getStatus()))).count();
        int progress = nodes.isEmpty() ? 0 : (int) Math.round((double) completedCount / nodes.size() * 100);

        mainQuest.setProgressPercentage(progress);
        if (progress == 100) {
            mainQuest.setStatus("COMPLETED");
            mainQuest.setCompletedAt(LocalDateTime.now());
        }

        // Unlock next nodes if prerequisite is completed
        for (int i = 0; i < nodes.size(); i++) {
            QuestNode current = nodes.get(i);
            if ("COMPLETED".equals(current.getStatus()) || (current.getQuest() != null && "COMPLETED".equals(current.getQuest().getStatus()))) {
                // Unlock next
                if (i + 1 < nodes.size()) {
                    QuestNode next = nodes.get(i + 1);
                    if ("LOCKED".equals(next.getStatus())) {
                        next.setStatus("AVAILABLE");
                        if (next.getQuest() != null) {
                            next.getQuest().setStatus("AVAILABLE");
                            questRepository.save(next.getQuest());
                        }
                        questNodeRepository.save(next);
                    }
                }
            }
        }

        MainQuest updated = mainQuestRepository.save(mainQuest);
        return convertToDTO(updated);
    }

    public MainQuestDTO convertToDTO(MainQuest mainQuest) {
        MainQuestDTO dto = new MainQuestDTO();
        dto.setId(mainQuest.getId());
        dto.setUserId(mainQuest.getUser().getId());
        dto.setTitle(mainQuest.getTitle());
        dto.setDescription(mainQuest.getDescription());
        dto.setCategory(mainQuest.getCategory());
        dto.setProgressPercentage(mainQuest.getProgressPercentage());
        dto.setStatus(mainQuest.getStatus());

        List<MainQuestDTO.NodeDTO> nodeDTOs = mainQuest.getNodes().stream().map(node -> {
            MainQuestDTO.NodeDTO nDto = new MainQuestDTO.NodeDTO();
            nDto.setId(node.getId());
            nDto.setMainQuestId(mainQuest.getId());
            if (node.getQuest() != null) {
                nDto.setQuestId(node.getQuest().getId());
                nDto.setStatus(node.getQuest().getStatus());
            } else {
                nDto.setStatus(node.getStatus());
            }
            nDto.setNodeName(node.getNodeName());
            nDto.setPrerequisiteNodeId(node.getPrerequisiteNodeId());
            nDto.setStepOrder(node.getStepOrder());
            return nDto;
        }).collect(Collectors.toList());

        dto.setNodes(nodeDTOs);
        return dto;
    }
}
