package com.liferpg.controller;

import com.liferpg.dto.InventoryDTO;
import com.liferpg.dto.ShopItemDTO;
import com.liferpg.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public ResponseEntity<List<ShopItemDTO>> getShopItems(Authentication authentication) {
        List<ShopItemDTO> items = shopService.getAllShopItems(authentication.getName());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<InventoryDTO> purchaseItem(Authentication authentication, @PathVariable Long id) {
        InventoryDTO purchased = shopService.purchaseItem(authentication.getName(), id);
        return ResponseEntity.ok(purchased);
    }
}
