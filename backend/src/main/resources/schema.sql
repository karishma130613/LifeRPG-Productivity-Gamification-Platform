-- Life RPG MySQL Schema Definitions

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS characters (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT 'default_starlight',
    class_name VARCHAR(50) DEFAULT 'Novice Adventurer',
    level INT DEFAULT 1,
    xp BIGINT DEFAULT 0,
    gold BIGINT DEFAULT 100,
    streak INT DEFAULT 0,
    last_active_date DATE,
    strength INT DEFAULT 10,
    intelligence INT DEFAULT 10,
    discipline INT DEFAULT 10,
    creativity INT DEFAULT 10,
    confidence INT DEFAULT 10,
    equipped_theme VARCHAR(50) DEFAULT 'starlight',
    equipped_frame VARCHAR(50) DEFAULT 'default',
    companion_name VARCHAR(50) DEFAULT 'Lumi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS boss_battles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    max_hp INT NOT NULL,
    current_hp INT NOT NULL,
    is_defeated BOOLEAN DEFAULT FALSE,
    xp_reward INT DEFAULT 500,
    gold_reward INT DEFAULT 250,
    icon_name VARCHAR(50) DEFAULT 'boss_default',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'MEDIUM',
    xp_reward INT NOT NULL,
    gold_reward INT NOT NULL,
    due_date DATE,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    is_main_quest BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    proof_url VARCHAR(500),
    proof_notes TEXT,
    boss_id BIGINT,
    game_type VARCHAR(50) DEFAULT 'RHYTHM_SLASH',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (boss_id) REFERENCES boss_battles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS main_quests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    progress_percentage INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quest_nodes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    main_quest_id BIGINT NOT NULL,
    quest_id BIGINT,
    node_name VARCHAR(150) NOT NULL,
    prerequisite_node_id BIGINT,
    status VARCHAR(20) DEFAULT 'LOCKED',
    step_order INT DEFAULT 1,
    FOREIGN KEY (main_quest_id) REFERENCES main_quests(id) ON DELETE CASCADE,
    FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS world_regions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    min_level INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    theme_color VARCHAR(30) DEFAULT 'blue',
    icon_name VARCHAR(50) DEFAULT 'base_icon'
);

CREATE TABLE IF NOT EXISTS user_world_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    region_id BIGINT NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (region_id) REFERENCES world_regions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    xp_reward INT DEFAULT 100,
    gold_reward INT DEFAULT 50,
    badge_icon VARCHAR(50) NOT NULL,
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    achievement_id BIGINT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shop_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    price_gold INT NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    cosmetic_value VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    is_rare BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    shop_item_id BIGINT NOT NULL,
    is_equipped BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_item_id) REFERENCES shop_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_date DATE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    xp_bonus INT DEFAULT 50,
    gold_bonus INT DEFAULT 25,
    requirement_target INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_daily_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    daily_event_id BIGINT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (daily_event_id) REFERENCES daily_events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'MEDIUM',
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    score INT DEFAULT 0,
    accuracy DOUBLE DEFAULT 0.0,
    linked_quest_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    best_score INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_played_date DATE,
    total_xp_earned BIGINT DEFAULT 0,
    total_gold_earned BIGINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, game_id)
);

CREATE TABLE IF NOT EXISTS daily_game_challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    challenge_date DATE NOT NULL,
    target_count INT DEFAULT 2,
    completed_count INT DEFAULT 0,
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (user_id, challenge_date)
);
