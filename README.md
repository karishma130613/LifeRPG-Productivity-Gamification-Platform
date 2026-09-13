# 🎮 LifeRPG – Productivity Gamification Platform

> **"Don't just track your life. Play it."**  
> *"Your real-life progress lights up your world."*

LifeRPG is a gamified productivity and personal growth platform that transforms everyday tasks, study sessions, habits, and personal goals into an immersive fantasy RPG experience.

Users complete quests, earn XP and virtual Gold, develop their Life DNA attributes, battle productivity bosses, unlock mystical regions across the Starlight Realm, play skill mini-games, maintain streaks, unlock achievements, and interact with **Lumi**, their virtual RPG companion.

The goal is simple: **Make productivity feel like playing a game. 🚀**

---

## 👥 Team Members

* **Karishma G**
* **Kamali M**
* **Kaniga A**
* **Manjusri R**

---

## ⚔️ Key Features

### 1. 📜 Quests & Habit System
* **Real-Life XP & Gold**: Complete daily habits, urgent tasks, or deep-work milestones to earn XP and coins calculated server-side.
* **Dynamic Difficulty**: Quests scale in rewards based on difficulty (`TRIVIAL`, `EASY`, `MEDIUM`, `HARD`, `EPIC`) and domain.
* **Proof & Notes**: Attach victory reflections or completion notes to every conquered quest.
* Complete quests to progress through the RPG world and damage active bosses.

### 2. 🎮 Game Realm & Mini-Games
Play mini-games that sharpen focus and productivity while earning progression rewards:
* ⭐ **Memory Stars**: Test visual recall and memory.
* 🧠 **Mind Maze**: Navigate spatial puzzle pathways.
* 🔢 **Number Forge**: Solve quick mental arithmetic challenges.
* 🎯 **Focus Strike**: Train reaction time and precision.
* 📖 **Word Quest**: Vocabulary and language agility challenges.
* 🌟 **Star Catcher**: Fast-paced reflex arcade mini-game.

Each game features score tracking, difficulty levels, XP & Gold rewards, best scores, game statistics, and streak bonuses.

### 3. 🧬 Life DNA & Dynamic Classes
Develop six foundational attributes through your real-world activities:
* 💪 **Strength (STR)**: Fitness, physical vigor, athletics
* 🧠 **Intellect (INT)**: Reading, learning, research, coding
* 📚 **Discipline (DIS)**: Habit streaks, focus, consistency
* 🎨 **Creativity (CRE)**: Design, writing, art, innovation
* ❤️ **Vitality (VIT)**: Sleep, nutrition, mental health, wellness
* 💬 **Charisma (CHA)**: Social connection, speaking, leadership

Your dominant attributes dynamically determine your RPG Class (e.g. *Starlight Paladin*, *Astral Scholar*, *Zen Monk*, *Sovereign Leader*).

### 4. 🐉 Boss Battles (Colossal Hurdles)
Turn intimidating real-world projects, exam periods, or procrastination hurdles into raid bosses with tangible HP bars. Every completed quest deals damage directly to active bosses until they are vanquished, rewarding massive XP and legendary titles.

### 5. 🗺️ Quest Maps & Epic Journeys
* Multi-step visual node pathways (e.g., "Master Full-Stack Java", "Run a Half Marathon") rendered as interactive constellation graphs.
* Track milestones sequentially with prerequisite gates and node rewards.

### 6. 🌍 The Starlight Realms (World Map)
As your character levels up, you illuminate 5 mystical realms across the world map:
* **Whispering Woods** (Level 1)
* **Sunken Archives** (Level 3)
* **Citadel of Discipline** (Level 5)
* **Celestial Peak** (Level 8)
* **Astral Void** (Level 10)

### 7. ✨ Lumi — Your Guardian Companion
An expressive, animated companion spirit with 6 emotional states (`idle`, `happy`, `excited`, `thinking`, `celebrating`, `victory`). Lumi provides encouraging messages and celebrations throughout your journey.

### 8. 🤖 AI Quest Planner
Input any ambitious or fuzzy goal (e.g. "Prepare for Google coding interview in 30 days" or "Run my first 10k") and generate structured, actionable quest blueprints with categorized sub-tasks, suggested difficulty, and rewards.

### 9. 🏆 Achievements & Streaks
Unlock trophies across milestones (First Victory, Mind Master, Star Collector, Game Streak, Perfect Focus, Arcade Legend). Build consistency through daily activity without negative or shame-based penalties.

### 10. 🛍️ Celestial Bazaar & Adventurer's Pack
Earn virtual Gold through productivity and mini-games to unlock vanity titles, companion spirit skins, and badge flairs. Equip and unequip items directly in your inventory.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19, Vite, React Router v6
* **Styling**: Tailwind CSS v3 (Starlight Adventure design system: midnight blues, gold accents, glassmorphism)
* **Animations**: Framer Motion, Canvas Starlight Starfield, Canvas Confetti
* **Icons**: Lucide React
* **HTTP Client**: Axios with JWT request/response interceptors

### Backend
* **Language & Framework**: Java 17, Spring Boot 3.2.3
* **Security**: Spring Security, Stateless JWT Authentication (HMAC-SHA256)
* **Persistence**: Spring Data JPA, Hibernate
* **Database**: MySQL compatible with zero-config embedded H2 fallback

---

## 📁 Project Structure

```text
LifeRPG/
│
├── backend/
│   ├── src/main/java/com/liferpg/
│   │   ├── config/          # Security & CORS configuration
│   │   ├── controller/      # REST API Controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA Entities
│   │   ├── exception/       # Global Exception Handling
│   │   ├── repository/      # Spring Data Repositories
│   │   ├── security/        # JWT & UserDetails implementation
│   │   └── service/         # Core business logic & validation
│   ├── src/main/resources/  # application.yml, schema.sql, data.sql
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Media & SVG assets
│   │   ├── components/      # UI components & mini-games
│   │   ├── context/         # Auth, Theme, and Game state contexts
│   │   ├── pages/           # Application views/routes
│   │   ├── services/        # Axios API client services
│   │   └── utils/           # Audio/Sound effects helpers
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🔌 API Endpoints Summary

| Group | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new hero account |
| **Auth** | `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| **Character** | `GET` | `/api/character` | Fetch player profile, stats, Life DNA |
| **Quests** | `GET` | `/api/quests` | List user quests (filters: status, category) |
| **Quests** | `POST` | `/api/quests` | Create new quest |
| **Quests** | `PUT` | `/api/quests/{id}` | Update existing quest |
| **Quests** | `DELETE` | `/api/quests/{id}` | Delete quest |
| **Quests** | `POST` | `/api/quests/{id}/complete` | Complete quest & process XP/Gold/Boss damage |
| **Main Quests**| `GET` | `/api/main-quests` | Fetch multi-stage journey maps & nodes |
| **Main Quests**| `POST` | `/api/main-quests` | Create new journey with sequential nodes |
| **Games** | `GET` | `/api/games` | List mini-games |
| **Games** | `GET` | `/api/games/stats` | Get user game stats |
| **Games** | `POST` | `/api/games/{gameId}/start` | Start verified game session |
| **Games** | `POST` | `/api/games/{gameId}/complete` | Complete game session & claim validated rewards |
| **Games** | `GET` | `/api/games/leaderboard` | Mini-game leaderboards |
| **Bosses** | `GET` | `/api/bosses` | List active and vanquished boss monsters |
| **Bosses** | `POST` | `/api/bosses` | Summon a new boss raid |
| **World** | `GET` | `/api/world` | List world regions and illumination status |
| **Shop** | `GET` | `/api/shop` | List vanity shop items & prices |
| **Shop** | `POST` | `/api/shop/{id}/purchase` | Purchase item with virtual gold |
| **Inventory** | `GET` | `/api/inventory` | List owned items and equip states |
| **Inventory** | `POST` | `/api/inventory/{id}/equip` | Equip item |
| **Inventory** | `POST` | `/api/inventory/{id}/unequip` | Unequip item |
| **Achievements**| `GET`| `/api/achievements` | List unlocked & locked trophies |
| **AI Planner** | `POST` | `/api/ai/plan` | Generate structured quest blueprint |
| **Events** | `GET` | `/api/events/today` | Fetch daily celestial event & bonus buff |

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17 or higher
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### 1. Running the Backend

Open a terminal in the `backend/` directory:

```bash
cd backend

# On Windows (PowerShell/CMD):
.\mvnw.cmd spring-boot:run

# On Linux/macOS:
./mvnw spring-boot:run
```

- The backend will start at `http://localhost:8080`.
- **Database**: By default, it runs with embedded in-memory H2 database (with preloaded sample world regions, achievements, and shop items).
- **H2 Console**: Accessible at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:liferpgdb`, User: `sa`, Password: empty).
- **MySQL (Optional)**: To use MySQL instead, configure `application.yml` or set environment variables:
  ```env
  SPRING_PROFILES_ACTIVE=mysql
  DB_URL=jdbc:mysql://localhost:3306/liferpg?createDatabaseIfNotExist=true&useSSL=false
  DB_USERNAME=root
  DB_PASSWORD=yourpassword
  ```

---

### 2. Running the Frontend

Open a new terminal in the `frontend/` directory:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

- The frontend will start at `http://localhost:5173`.
- Open `http://localhost:5173` in your browser.

---

## 🎨 Design System: Starlight Adventure

- **Backgrounds**: Deep midnight blue (`#0B0E17`), Dark Navy (`#111827`)
- **Primary Glow**: Amethyst & Starlight Purple (`#8B5CF6`, `#7C3AED`)
- **Treasury & Accents**: Radiant Gold (`#F59E0B`, `#FBBF24`)
- **Glassmorphism**: Backdrop blur with frosted borders (`rgba(255, 255, 255, 0.08)`)
- **Typography**: Space Grotesk / Outfit for headings, Inter for readable UI body

---

## 🔒 Security & Fair Play
- All XP, Gold, Level Up, and Boss HP damage calculations are verified and executed strictly on the backend server.
- Passwords hashed with BCrypt.
- Virtual currency only: No real money transactions or pay-to-win mechanics.
- Inclusive and positive: No negative streak shaming or HP punishments.

---

## 📄 License
MIT License. Built for heroes leveling up in the real world.
