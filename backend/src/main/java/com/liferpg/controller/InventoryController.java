package com.liferpg.controller;

import com.liferpg.dto.InventoryDTO;
import com.liferpg.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getInventory(Authentication authentication) {
        List<InventoryDTO> items = shopService.getUserInventory(authentication.getName());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/{id}/equip")
    public ResponseEntity<InventoryDTO> equipItem(Authentication authentication, @PathVariable Long id) {
        InventoryDTO equipped = shopService.equipItem(authentication.getName(), id);
        return ResponseEntity.ok(equipped);
    }

    @PostMapping("/{id}/unequip")
    public ResponseEntity<InventoryDTO> unequipItem(Authentication authentication, @PathVariable Long id) {
        InventoryDTO unequipped = shopService.unequipItem(authentication.getName(), id);
        return ResponseEntity.ok(unequipped);
    }
}
