package com.liferpg.dto;

public class ShopItemDTO {

    private Long id;
    private String name;
    private String description;
    private String category;
    private Integer priceGold;
    private String itemType;
    private String cosmeticValue;
    private String iconName;
    private Boolean isRare;
    private Boolean isPurchased;
    private Boolean isEquipped;

    public ShopItemDTO() {
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getPriceGold() { return priceGold; }
    public void setPriceGold(Integer priceGold) { this.priceGold = priceGold; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public String getCosmeticValue() { return cosmeticValue; }
    public void setCosmeticValue(String cosmeticValue) { this.cosmeticValue = cosmeticValue; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public Boolean getIsRare() { return isRare; }
    public void setIsRare(Boolean isRare) { this.isRare = isRare; }

    public Boolean getIsPurchased() { return isPurchased; }
    public void setIsPurchased(Boolean isPurchased) { this.isPurchased = isPurchased; }

    public Boolean getIsEquipped() { return isEquipped; }
    public void setIsEquipped(Boolean isEquipped) { this.isEquipped = isEquipped; }
}
