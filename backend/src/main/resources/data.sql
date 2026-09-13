-- Seed World Regions
MERGE INTO world_regions (id, region_name, description, min_level, category, theme_color, icon_name) KEY(id) VALUES
(1, 'Your Base', 'A quiet, peaceful sanctuary beneath the starlight sky where your journey begins.', 1, 'Base', 'indigo', 'Home'),
(2, 'Knowledge Tower', 'A grand magical library filled with ancient scrolls and wisdom for deep learning.', 5, 'Study', 'purple', 'BookOpen'),
(3, 'Skill Arena', 'A glowing cybernetic colosseum where coding challenges and career skills are forged.', 10, 'Coding', 'cyan', 'Code'),
(4, 'Creativity Forest', 'An enchanted woods illuminated by bioluminescent flora for artistic creation.', 15, 'Creativity', 'emerald', 'Palette'),
(5, 'Adventure Peaks', 'Majestic mountain summits touching the galaxy for epic life boss milestones.', 20, 'Career', 'amber', 'Mountain');

-- Seed Achievements
MERGE INTO achievements (id, code, name, description, category, xp_reward, gold_reward, badge_icon, requirement_type, requirement_value) KEY(id) VALUES
(1, 'FIRST_QUEST', 'First Step', 'Completed your very first quest in Life RPG.', 'General', 100, 50, 'Footprints', 'QUESTS_COMPLETED', 1),
(2, 'QUEST_10', 'Adventurer', 'Completed 10 real-life quests.', 'General', 250, 100, 'Shield', 'QUESTS_COMPLETED', 10),
(3, 'QUEST_50', 'Hero of Destiny', 'Completed 50 quests across your life journey.', 'General', 1000, 500, 'Award', 'QUESTS_COMPLETED', 50),
(4, 'STREAK_7', 'Unstoppable Flame', 'Maintained a 7-day active quest completion streak.', 'Streak', 300, 150, 'Flame', 'STREAK_DAYS', 7),
(5, 'STREAK_30', 'Master of Consistency', 'Maintained a 30-day active productivity streak.', 'Streak', 1500, 750, 'Zap', 'STREAK_DAYS', 30),
(6, 'LEVEL_10', 'Rising Star', 'Reached Level 10 in Life RPG.', 'Level', 500, 250, 'Star', 'LEVEL', 10),
(7, 'BOSS_FIRST', 'Boss Slayer', 'Defeated your first real-life Boss Battle goal.', 'Boss', 750, 400, 'Skull', 'BOSS_DEFEATED', 1),
(8, 'GOLD_1000', 'Gold Hoarder', 'Accumulated 1,000 Virtual Gold in your treasury.', 'Economy', 200, 100, 'Coins', 'GOLD_ACCUMULATED', 1000),
(9, 'INTEL_50', 'Mind Sovereign', 'Reached 50 Intelligence attribute points.', 'Attributes', 400, 200, 'Brain', 'INTELLIGENCE', 50),
(10, 'STRENGTH_50', 'Iron Discipline', 'Reached 50 Strength attribute points.', 'Attributes', 400, 200, 'Dumbbell', 'STRENGTH', 50),
(11, 'GAME_FIRST_WIN', 'Arcade Initiate', 'Achieved your first victory in the Game Realm.', 'Arcade', 100, 50, 'Gamepad2', 'GAMES_WON', 1),
(12, 'GAME_ARCADE_10', 'Realm Champion', 'Won 10 mini-game trials across the Realm.', 'Arcade', 500, 250, 'Trophy', 'GAMES_WON', 10);

-- Seed Shop Items
MERGE INTO shop_items (id, name, description, category, price_gold, item_type, cosmetic_value, icon_name, is_rare) KEY(id) VALUES
(1, 'Cosmic Nebula Theme', 'Imbue your dashboard with radiant purple and deep space galaxy gradients.', 'Theme', 250, 'THEME', 'theme-nebula', 'Sparkles', FALSE),
(2, 'Solar Flare Theme', 'Warm golden solar embers to energize your daily focus sessions.', 'Theme', 300, 'THEME', 'theme-solar', 'Sun', FALSE),
(3, 'Golden Champion Frame', 'A shining 24k gold avatar border reflecting legendary accomplishment.', 'Frame', 500, 'FRAME', 'frame-gold', 'Crown', TRUE),
(4, 'Starlight Aura Effect', 'Surround your character avatar with glowing celestial particle sparkles.', 'Aura', 750, 'AURA', 'aura-starlight', 'Zap', TRUE),
(5, 'Lumi Celestial Hat', 'Adorn your mascot Lumi with a glowing wizard crown.', 'Companion', 400, 'COMPANION_HAT', 'hat-wizard', 'Smile', FALSE),
(6, 'Legendary Dragon Badge', 'Display an epic draconic seal on your player profile card.', 'Badge', 600, 'BADGE', 'badge-dragon', 'Shield', TRUE);
