package com.liferpg.controller;

import com.liferpg.dto.WorldRegionDTO;
import com.liferpg.service.WorldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/world")
public class WorldController {

    @Autowired
    private WorldService worldService;

    @GetMapping
    public ResponseEntity<List<WorldRegionDTO>> getWorldRegions(Authentication authentication) {
        List<WorldRegionDTO> regions = worldService.getUserWorldRegions(authentication.getName());
        return ResponseEntity.ok(regions);
    }
}
