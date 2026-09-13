package com.liferpg.controller;

import com.liferpg.entity.DailyEvent;
import com.liferpg.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodayEvent(Authentication authentication) {
        DailyEvent event = eventService.getOrCreateTodayEvent();
        boolean isCompleted = eventService.isTodayEventCompleted(authentication.getName(), event.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("id", event.getId());
        response.put("title", event.getTitle());
        response.put("description", event.getDescription());
        response.put("category", event.getCategory());
        response.put("xpBonus", event.getXpBonus());
        response.put("goldBonus", event.getGoldBonus());
        response.put("isCompleted", isCompleted);

        return ResponseEntity.ok(response);
    }
}
