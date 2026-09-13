package com.liferpg.controller;

import com.liferpg.dto.CharacterDTO;
import com.liferpg.service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/character")
public class CharacterController {

    @Autowired
    private CharacterService characterService;

    @GetMapping
    public ResponseEntity<CharacterDTO> getMyCharacter(Authentication authentication) {
        CharacterDTO character = characterService.getCharacterByUsername(authentication.getName());
        return ResponseEntity.ok(character);
    }
}
