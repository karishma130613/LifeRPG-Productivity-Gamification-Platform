package com.liferpg.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "shop_items")
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "price_gold", nullable = false)
    private Integer priceGold;

    @Column(name = "item_type", nullable = false, length = 50)
    private String itemType;

    @Column(name = "cosmetic_value", nullable = false, length = 100)
    private String cosmeticValue;

    @Column(name = "icon_name", nullable = false, length = 50)
    private String iconName;

    @Column(name = "is_rare")
    private Boolean isRare = false;

    public ShopItem() {
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
}
