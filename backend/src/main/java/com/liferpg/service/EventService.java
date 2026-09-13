package com.liferpg.service;

import com.liferpg.entity.DailyEvent;
import com.liferpg.entity.User;
import com.liferpg.entity.UserDailyEvent;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.DailyEventRepository;
import com.liferpg.repository.UserDailyEventRepository;
import com.liferpg.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class EventService {

    @Autowired
    private DailyEventRepository dailyEventRepository;

    @Autowired
    private UserDailyEventRepository userDailyEventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public DailyEvent getOrCreateTodayEvent() {
        LocalDate today = LocalDate.now();
        return dailyEventRepository.findByEventDate(today).orElseGet(() -> {
            DailyEvent event = new DailyEvent();
            event.setEventDate(today);
            event.setTitle("Starlight Daily Focus Challenge");
            event.setDescription("Complete at least 1 main study or coding quest today to earn celestial rewards!");
            event.setCategory("Study");
            event.setXpBonus(75);
            event.setGoldBonus(40);
            event.setRequirementTarget(1);
            return dailyEventRepository.save(event);
        });
    }

    @Transactional(readOnly = true)
    public boolean isTodayEventCompleted(String username, Long eventId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userDailyEventRepository.findByUserIdAndDailyEventId(user.getId(), eventId)
                .map(UserDailyEvent::getIsCompleted)
                .orElse(false);
    }
}
