import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Coins,
  Sparkles,
  Check,
  ShieldAlert,
  Loader2,
  Tag,
  AlertCircle
} from 'lucide-react'
import { shopService, characterService } from '../services/services'
import { useGame } from '../context/GameContext'

export default function ShopPage() {
  const { character, updateCharacter, triggerLumi } = useGame()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasingId, setPurchasingId] = useState(null)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [message, setMessage] = useState(null)

  const loadShopData = useCallback(async () => {
    try {
      setLoading(true)
      const [shopData, charData] = await Promise.allSettled([
        shopService.getShopItems(),
        characterService.getCharacter(),
      ])
      if (shopData.status === 'fulfilled') setItems(shopData.value || [])
      if (charData.status === 'fulfilled') updateCharacter(charData.value)
    } catch (err) {
      console.error('Failed to load shop:', err)
    } finally {
      setLoading(false)
    }
  }, [updateCharacter])

  useEffect(() => {
    loadShopData()
  }, [loadShopData])

  const handlePurchase = async (item) => {
    if ((character?.gold || 0) < item.price) {
      setMessage({ type: 'error', text: 'Insufficient Gold! Conquer more quests to earn gold.' })
      triggerLumi("You need a few more coins for that artifact! Keep questing!", "thinking", 3500)
      return
    }

    try {
      setPurchasingId(item.id)
      const res = await shopService.purchaseItem(item.id)
      
      // Update character gold
      if (res.character) {
        updateCharacter(res.character)
      } else {
        updateCharacter({ ...character, gold: (character?.gold || 0) - item.price })
      }

      setMessage({ type: 'success', text: `Acquired ${item.name}! Check your inventory.` })
      triggerLumi(`Magnificent choice! ${item.name} is now yours!`, "victory", 4000)
      loadShopData()
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to complete transaction.',
      })
    } finally {
      setPurchasingId(null)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const categories = ['ALL', 'TITLE', 'PET', 'THEME', 'POTION']

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'ALL') return true
    return item.category?.toUpperCase() === activeCategory
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 lg:p-8 glass-card rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Celestial Bazaar</span>
          </div>
          <h1 className="font-title text-3xl sm:text-4xl font-extrabold text-white">
            RPG Merchant Outpost
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted max-w-xl leading-relaxed">
            Reinvest your discipline into legendary vanity titles, companion pets, and starlight flairs.
          </p>
        </div>

        {/* Gold Counter Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-midnight/90 border border-gold/40 shadow-glow-gold flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
            <Coins className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-starlight-muted tracking-wider">Your Treasury</div>
            <div className="font-mono text-2xl font-black text-gold">
              {character?.gold?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-gold text-midnight font-bold shadow-glow-gold'
                : 'glass-card text-starlight-muted hover:text-white border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shop Items Grid */}
      {loading ? (
        <div className="p-16 text-center text-starlight-muted">
          <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
          <p className="text-xs">Unpacking merchant wares...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 glass-card rounded-2xl border border-white/10 text-center text-starlight-muted">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No items available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const canAfford = (character?.gold || 0) >= item.price
            const isPurchasing = purchasingId === item.id

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="p-6 glass-card rounded-2xl border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-3xl">
                      {item.icon || '✨'}
                    </div>
                    <span className="badge-purple text-[10px]">{item.category}</span>
                  </div>

                  <h3 className="font-title text-base font-bold text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-starlight-muted leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-gold text-base">
                    <Coins className="w-4 h-4 text-gold" />
                    <span>{item.price}</span>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={isPurchasing}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canAfford
                        ? 'btn-gold shadow-glow-gold'
                        : 'bg-white/5 border border-white/10 text-starlight-muted hover:bg-white/10'
                    }`}
                  >
                    {isPurchasing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>{canAfford ? 'Acquire' : 'Need Gold'}</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
