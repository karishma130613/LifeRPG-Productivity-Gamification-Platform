package com.liferpg.service;

import com.liferpg.dto.InventoryDTO;
import com.liferpg.dto.ShopItemDTO;
import com.liferpg.entity.*;
import com.liferpg.exception.BadRequestException;
import com.liferpg.exception.ResourceNotFoundException;
import com.liferpg.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterProfileRepository characterProfileRepository;

    @Transactional(readOnly = true)
    public List<ShopItemDTO> getAllShopItems(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<ShopItem> items = shopItemRepository.findAll();
        List<InventoryItem> userInventory = inventoryItemRepository.findByUserId(user.getId());

        return items.stream().map(item -> {
            ShopItemDTO dto = convertToShopDTO(item);
            InventoryItem invItem = userInventory.stream()
                    .filter(inv -> inv.getShopItem().getId().equals(item.getId()))
                    .findFirst().orElse(null);

            dto.setIsPurchased(invItem != null);
            dto.setIsEquipped(invItem != null && invItem.getIsEquipped());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public InventoryDTO purchaseItem(String username, Long shopItemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ShopItem item = shopItemRepository.findById(shopItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop item not found"));

        if (inventoryItemRepository.existsByUserIdAndShopItemId(user.getId(), shopItemId)) {
            throw new BadRequestException("You already own this item!");
        }

        CharacterProfile character = characterProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Character profile not found"));

        if (character.getGold() < item.getPriceGold()) {
            throw new BadRequestException("Insufficient Virtual Gold! Required: " + item.getPriceGold() + ", Available: " + character.getGold());
        }

        // Deduct Gold server-side safely
        character.setGold(character.getGold() - item.getPriceGold());
        characterProfileRepository.save(character);

        InventoryItem inv = new InventoryItem(user, item);
        InventoryItem savedInv = inventoryItemRepository.save(inv);

        return convertToInventoryDTO(savedInv);
    }

    @Transactional(readOnly = true)
    public List<InventoryDTO> getUserInventory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<InventoryItem> inventory = inventoryItemRepository.findByUserId(user.getId());
        return inventory.stream().map(this::convertToInventoryDTO).collect(Collectors.toList());
    }

    @Transactional
    public InventoryDTO equipItem(String username, Long inventoryItemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InventoryItem targetItem = inventoryItemRepository.findById(inventoryItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        if (!targetItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied: Item does not belong to you");
        }

        List<InventoryItem> allUserItems = inventoryItemRepository.findByUserId(user.getId());
        String itemType = targetItem.getShopItem().getItemType();

        // Unequip any existing item of the same type
        for (InventoryItem inv : allUserItems) {
            if (inv.getShopItem().getItemType().equalsIgnoreCase(itemType)) {
                inv.setIsEquipped(false);
                inventoryItemRepository.save(inv);
            }
        }

        targetItem.setIsEquipped(true);
        InventoryItem saved = inventoryItemRepository.save(targetItem);

        // Update character equipped theme/frame if relevant
        CharacterProfile character = characterProfileRepository.findByUser(user).orElse(null);
        if (character != null) {
            if ("THEME".equalsIgnoreCase(itemType)) {
                character.setEquippedTheme(targetItem.getShopItem().getCosmeticValue());
            } else if ("FRAME".equalsIgnoreCase(itemType)) {
                character.setEquippedFrame(targetItem.getShopItem().getCosmeticValue());
            }
            characterProfileRepository.save(character);
        }

        return convertToInventoryDTO(saved);
    }

    @Transactional
    public InventoryDTO unequipItem(String username, Long inventoryItemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InventoryItem targetItem = inventoryItemRepository.findById(inventoryItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        if (!targetItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        targetItem.setIsEquipped(false);
        InventoryItem saved = inventoryItemRepository.save(targetItem);

        // Revert to default theme/frame if needed
        CharacterProfile character = characterProfileRepository.findByUser(user).orElse(null);
        if (character != null) {
            String itemType = targetItem.getShopItem().getItemType();
            if ("THEME".equalsIgnoreCase(itemType)) {
                character.setEquippedTheme("starlight");
            } else if ("FRAME".equalsIgnoreCase(itemType)) {
                character.setEquippedFrame("default");
            }
            characterProfileRepository.save(character);
        }

        return convertToInventoryDTO(saved);
    }

    public ShopItemDTO convertToShopDTO(ShopItem item) {
        ShopItemDTO dto = new ShopItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory());
        dto.setPriceGold(item.getPriceGold());
        dto.setItemType(item.getItemType());
        dto.setCosmeticValue(item.getCosmeticValue());
        dto.setIconName(item.getIconName());
        dto.setIsRare(item.getIsRare());
        return dto;
    }

    public InventoryDTO convertToInventoryDTO(InventoryItem item) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(item.getId());
        dto.setShopItemId(item.getShopItem().getId());
        dto.setName(item.getShopItem().getName());
        dto.setDescription(item.getShopItem().getDescription());
        dto.setCategory(item.getShopItem().getCategory());
        dto.setItemType(item.getShopItem().getItemType());
        dto.setCosmeticValue(item.getShopItem().getCosmeticValue());
        dto.setIconName(item.getShopItem().getIconName());
        dto.setIsEquipped(item.getIsEquipped());
        dto.setPurchasedAt(item.getPurchasedAt());
        return dto;
    }
}
