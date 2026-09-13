package com.liferpg.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shop_item_id", nullable = false)
    private ShopItem shopItem;

    @Column(name = "is_equipped")
    private Boolean isEquipped = false;

    @Column(name = "purchased_at", updatable = false)
    private LocalDateTime purchasedAt;

    public InventoryItem() {
    }

    public InventoryItem(User user, ShopItem shopItem) {
        this.user = user;
        this.shopItem = shopItem;
        this.isEquipped = false;
        this.purchasedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.purchasedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ShopItem getShopItem() { return shopItem; }
    public void setShopItem(ShopItem shopItem) { this.shopItem = shopItem; }

    public Boolean getIsEquipped() { return isEquipped; }
    public void setIsEquipped(Boolean isEquipped) { this.isEquipped = isEquipped; }

    public LocalDateTime getPurchasedAt() { return purchasedAt; }
    public void setPurchasedAt(LocalDateTime purchasedAt) { this.purchasedAt = purchasedAt; }
}
