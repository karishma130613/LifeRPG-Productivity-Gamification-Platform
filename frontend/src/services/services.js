import api from './api'

export const authService = {
  register: (data) => api.post('/api/auth/register', data).then(r => r.data),
  login:    (data) => api.post('/api/auth/login', data).then(r => r.data),
}

export const characterService = {
  getCharacter: () => api.get('/api/character').then(r => r.data),
}

export const questService = {
  getQuests:    (params) => api.get('/api/quests', { params }).then(r => r.data),
  createQuest:  (data)   => api.post('/api/quests', data).then(r => r.data),
  updateQuest:  (id, data) => api.put(`/api/quests/${id}`, data).then(r => r.data),
  deleteQuest:  (id)     => api.delete(`/api/quests/${id}`).then(r => r.data),
  completeQuest:(id, payload) => api.post(`/api/quests/${id}/complete`, payload || {}).then(r => r.data),
}

export const mainQuestService = {
  getMainQuests:   () => api.get('/api/main-quests').then(r => r.data),
  createMainQuest: (data) => api.post('/api/main-quests', data).then(r => r.data),
}

export const bossService = {
  getBosses:   () => api.get('/api/bosses').then(r => r.data),
  createBoss:  (data) => api.post('/api/bosses', data).then(r => r.data),
}

export const worldService = {
  getWorld: () => api.get('/api/world').then(r => r.data),
}

export const achievementService = {
  getAchievements: () => api.get('/api/achievements').then(r => r.data),
}

export const shopService = {
  getShopItems:  () => api.get('/api/shop').then(r => r.data),
  purchaseItem:  (id) => api.post(`/api/shop/${id}/purchase`).then(r => r.data),
}

export const inventoryService = {
  getInventory:  () => api.get('/api/inventory').then(r => r.data),
  equipItem:     (id) => api.post(`/api/inventory/${id}/equip`).then(r => r.data),
  unequipItem:   (id) => api.post(`/api/inventory/${id}/unequip`).then(r => r.data),
}

export const aiService = {
  generatePlan: (data) => api.post('/api/ai/plan', data).then(r => r.data),
}

export const eventService = {
  getTodayEvent: () => api.get('/api/events/today').then(r => r.data),
}

export const gameService = {
  getGames:         () => api.get('/api/games').then(r => r.data),
  getGameStats:     () => api.get('/api/games/stats').then(r => r.data),
  getDailyChallenge:() => api.get('/api/games/daily-challenge').then(r => r.data),
  claimDailyChallenge: () => api.post('/api/games/daily-challenge/claim').then(r => r.data),
  getLeaderboard:   () => api.get('/api/games/leaderboard').then(r => r.data),
  getHistory:       () => api.get('/api/games/history').then(r => r.data),
  startGame:        (gameId, data) => api.post(`/api/games/${gameId}/start`, data || {}).then(r => r.data),
  completeGame:     (gameId, data) => api.post(`/api/games/${gameId}/complete`, data).then(r => r.data),
}
