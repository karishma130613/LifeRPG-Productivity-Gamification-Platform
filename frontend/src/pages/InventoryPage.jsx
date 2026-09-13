import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Check,
  ShoppingBag,
  Loader2
} from 'lucide-react'
import { inventoryService, characterService } from '../services/services'
import { useGame } from '../context/GameContext'

export default function InventoryPage() {
  const { character, updateCharacter, triggerLumi } = useGame()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [filter, setFilter] = useState('ALL') // 'ALL', 'EQUIPPED'

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true)
      const data = await inventoryService.getInventory()
      setItems(data || [])
    } catch (err) {
      console.error('Failed to load inventory:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const handleToggleEquip = async (item) => {
    try {
      setActionId(item.id)
      let res
      if (item.equipped) {
        res = await inventoryService.unequipItem(item.id)
        triggerLumi(`Unequipped ${item.shopItem?.name}.`, 'idle', 3000)
      } else {
        res = await inventoryService.equipItem(item.id)
        triggerLumi(`Equipped ${item.shopItem?.name}! Looking magnificent!`, 'excited', 3500)
      }

      // Refresh character stats
      const updatedChar = await characterService.getCharacter()
      updateCharacter(updatedChar)

      loadInventory()
    } catch (err) {
      console.error('Failed to toggle equip:', err)
    } finally {
      setActionId(null)
    }
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'EQUIPPED') return item.equipped
    return true
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-gold" />
            <span>Adventurer's Pack</span>
          </h1>
          <p className="text-xs sm:text-sm text-starlight-muted mt-1">
            Manage your collected artifacts, titles, vanity badges, and companion spirits
          </p>
        </div>

        <Link
          to="/shop"
          className="btn-gold text-xs sm:text-sm font-bold flex items-center gap-2 shadow-glow-gold"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Visit Celestial Bazaar</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'EQUIPPED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-gold text-midnight font-bold shadow-glow-gold'
                : 'glass-card text-starlight-muted hover:text-white border border-white/5'
            }`}
          >
            {tab.toLowerCase()} ({tab === 'ALL' ? items.length : items.filter((i) => i.equipped).length})
          </button>
        ))}
      </div>

      {/* Inventory Grid */}
      {loading ? (
        <div className="p-16 text-center text-starlight-muted">
          <Sparkles className="w-6 h-6 text-gold animate-spin mx-auto mb-2" />
          <p className="text-xs">Opening adventurer satchel...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 glass-card rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-starlight-muted">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-title text-lg font-bold text-white">Your Pack is Empty</h3>
            <p className="text-xs text-starlight-muted max-w-sm mx-auto mt-1">
              Visit the Celestial Bazaar to exchange your quest gold for epic titles, companions, and relics.
            </p>
          </div>
          <Link to="/shop" className="btn-gold text-xs font-bold px-4 py-2 inline-block">
            Browse Merchant Outpost
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isProcessing = actionId === item.id
            const details = item.shopItem || {}

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className={`p-6 glass-card rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  item.equipped ? 'border-gold/50 bg-gold/5' : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-3xl">
                      {details.icon || '✨'}
                    </div>
                    {item.equipped ? (
                      <span className="badge-gold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Equipped</span>
                      </span>
                    ) : (
                      <span className="badge-purple text-[10px]">{details.category || 'ITEM'}</span>
                    )}
                  </div>

                  <h3 className="font-title text-base font-bold text-white mb-1">
                    {details.name || 'Artifact'}
                  </h3>
                  <p className="text-xs text-starlight-muted leading-relaxed line-clamp-2">
                    {details.description || 'A mystical artifact from your adventures.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-starlight-muted font-mono">
                    Qty: {item.quantity || 1}
                  </span>

                  <button
                    onClick={() => handleToggleEquip(item)}
                    disabled={isProcessing}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      item.equipped
                        ? 'btn-ghost text-starlight-muted hover:text-white'
                        : 'btn-primary'
                    }`}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>{item.equipped ? 'Unequip' : 'Equip'}</span>
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
