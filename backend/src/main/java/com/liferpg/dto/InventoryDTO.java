package com.liferpg.dto;

import java.time.LocalDateTime;

public class InventoryDTO {

    private Long id;
    private Long shopItemId;
    private String name;
    private String description;
    private String category;
    private String itemType;
    private String cosmeticValue;
    private String iconName;
    private Boolean isEquipped;
    private LocalDateTime purchasedAt;

    public InventoryDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getShopItemId() { return shopItemId; }
    public void setShopItemId(Long shopItemId) { this.shopItemId = shopItemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public String getCosmeticValue() { return cosmeticValue; }
    public void setCosmeticValue(String cosmeticValue) { this.cosmeticValue = cosmeticValue; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public Boolean getIsEquipped() { return isEquipped; }
    public void setIsEquipped(Boolean isEquipped) { this.isEquipped = isEquipped; }

    public LocalDateTime getPurchasedAt() { return purchasedAt; }
    public void setPurchasedAt(LocalDateTime purchasedAt) { this.purchasedAt = purchasedAt; }
}
