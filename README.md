# 🎮 LifeRPG – Productivity Gamification Platform

> **Turn your real-life goals into an RPG adventure.**

LifeRPG is a gamified productivity and personal growth platform that transforms everyday tasks, goals, and habits into an interactive RPG experience.

Users can complete quests, earn XP and virtual Gold, improve their Life DNA attributes, battle productivity bosses, unlock new areas, play mini-games, maintain streaks, unlock achievements, and interact with **Lumi**, their virtual RPG companion.

The goal is simple:

**Make productivity feel like playing a game. 🚀**

---

## ✨ Features

### 🎯 Quest System

Turn real-life tasks and goals into RPG quests.

* Create and manage quests
* Different quest difficulties
* Earn XP and Gold
* Add notes or proof to quests
* Track quest progress
* Complete quests to progress through the RPG world

### 🎮 Game Realm

Play mini-games while improving productivity and skills.

Current mini-games include:

* ⭐ Memory Stars
* 🧠 Mind Maze
* 🔢 Number Forge
* 🎯 Focus Strike
* 📖 Word Quest
* 🌟 Star Catcher

Each game includes:

* Score tracking
* Difficulty levels
* XP rewards
* Gold rewards
* Best scores
* Game statistics
* Streak tracking

### 🧬 Life DNA

Develop six different attributes through your activities:

* 💪 Strength
* 🧠 Intellect
* 📚 Discipline
* 🎨 Creativity
* ❤️ Vitality
* 💬 Charisma

Your activities influence your attributes and help determine your RPG progression.

### ⚔️ Boss Battles

Turn real-world obstacles into RPG bosses.

Completing related quests and challenges can damage active bosses.

Features include:

* Boss HP
* Quest-based damage
* Boss defeat animations
* Rewards
* Victory celebrations

### 🗺️ World Map

Explore a fantasy world as you level up.

New regions and challenges become available as your character progresses.

### 🧭 Epic Journeys

Complete multi-step quest paths with:

* Visual progression nodes
* Prerequisites
* Rewards
* Multiple stages
* Long-term goals

### 🌟 Lumi – Your RPG Companion

Meet **Lumi**, your interactive companion.

Lumi reacts to your progress with different states:

* Idle
* Happy
* Excited
* Thinking
* Celebrating
* Victory

Lumi provides encouraging messages and reactions throughout your journey.

### 🏆 Achievements

Unlock achievements by reaching milestones.

Examples:

* First Victory
* Mind Master
* Star Collector
* Game Streak
* Perfect Focus
* Arcade Legend

### 🔥 Streak System

Build consistency through daily activity.

Track:

* Current streak
* Longest streak
* Game streak
* Daily challenges
* Milestone rewards

### 🤖 AI Quest Planner

Generate structured quests using AI based on user goals.

The AI Quest Planner helps convert larger goals into manageable RPG-style tasks.

### 💰 Rewards & Inventory

Earn virtual Gold and rewards by completing activities.

Use your rewards through the in-game economy, including:

* Inventory
* Celestial Bazaar
* Unlockable items
* Progression rewards

---

# 🎮 Game-to-Quest Integration

Games are not separate from the productivity system.

They are directly connected to quests.

Example:

```text
Quest
  ↓
Play Game
  ↓
Complete Challenge
  ↓
Backend Validation
  ↓
Quest Progress
  ↓
XP + Gold
  ↓
Boss Damage
  ↓
Achievement Check
  ↓
Lumi Celebration
```

This makes mini-games part of the user's overall RPG progression.

---

# 🏆 Daily Game Challenge

Players can receive special daily challenges such as:

> 🎮 Complete 2 mini-games today.

Example reward:

```text
⭐ +150 XP
💰 +75 Gold
🔥 +1 Streak
```

Daily challenges encourage consistent engagement without using negative or shame-based penalties.

---

# 🛡️ Secure Reward System

XP, Gold, level progression, quest completion, and Boss damage are handled by the backend.

The frontend cannot simply send a score and award itself rewards.

Game sessions are validated by the backend before rewards are granted.

This helps prevent:

* Duplicate rewards
* Invalid game results
* Unauthorized progression
* Fake scores
* Repeated reward claims

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* Axios
* Lucide Icons
* Canvas-based visual effects

## Backend

* Java 17
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate

## Database

* MySQL
* H2 for development/testing

---

# 📁 Project Structure

```text
LifeRPG/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── games/
│   │   ├── services/
│   │   └── assets/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# 🔌 API Overview

## Quest APIs

```http
GET    /api/quests
POST   /api/quests
PUT    /api/quests/{id}
DELETE /api/quests/{id}
POST   /api/quests/{id}/complete
```

## Game APIs

```http
GET    /api/games
GET    /api/games/stats
GET    /api/games/{gameId}
POST   /api/games/{gameId}/start
POST   /api/games/{gameId}/complete
GET    /api/games/history
GET    /api/games/leaderboard
```

Additional APIs support:

* Character
* Bosses
* World Map
* Shop
* Inventory
* Achievements
* AI Quest Planner
* Events

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Java 17+
* Node.js
* npm
* MySQL (if using MySQL)

---

## ⚙️ Backend Setup

Open a terminal:

```bash
cd backend
```

Run the Spring Boot application:

### Windows

```bash
.\mvnw.cmd spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

## 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🎨 Design Philosophy

LifeRPG uses a fantasy-inspired **Starlight** visual identity.

The interface combines:

* 🌌 Midnight backgrounds
* 💜 Purple magical glow
* ✨ Star particles
* 🪟 Glassmorphism
* 🟡 Gold reward accents
* 🎮 Game-inspired UI
* 🧙 Fantasy RPG elements
* 🎬 Smooth animations

The goal is to create an experience inspired by the feeling of:

**Productivity + RPG + Casual Games + Adventure**

while maintaining its own original identity.

---

# 📱 Responsive Design

LifeRPG is designed to work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📲 Tablet

The Game Realm and mini-games are optimized for both mouse and touch interaction.

---

# 🔐 Authentication & Security

The application uses:

* JWT authentication
* Spring Security
* Protected API endpoints
* Backend-side reward validation
* User-specific progression

Sensitive game and progression calculations are handled on the server.

---

# 🌟 Future Enhancements

Possible future improvements include:

* 🎮 More mini-games
* 🤖 Smarter AI Quest Planner
* 🧙 More RPG character classes
* 🗺️ Larger world map
* 🐉 More Boss Battles
* 👥 Multiplayer challenges
* 🏆 Seasonal events
* 🎁 More inventory items
* 🌎 More fantasy regions
* 📊 Advanced productivity analytics
* 🎨 More Lumi animations
* 🧩 More interactive quest maps

---

# 🎯 Project Goal

Traditional productivity applications can feel repetitive.

LifeRPG attempts to solve this by transforming everyday progress into a game-like experience.

Instead of simply seeing:

```text
✓ Task Completed
```

the user experiences:

```text
⚔️ Quest Completed!
⭐ +100 XP
💰 +50 Gold
🧠 Intellect Increased
🐉 Boss Damaged
🏆 Achievement Unlocked
✨ Lumi Celebrates
```

This makes everyday productivity feel more engaging, interactive, and rewarding.

---

# 👩‍💻 Project

**Project Name:** LifeRPG – Productivity Gamification Platform

**Category:** AI / Full-Stack Web Application / Gamification

**Purpose:** Personal productivity, goal tracking, habit building, and skill development through RPG mechanics.

---

## ⭐ Core Concept

> **Don't just complete your tasks. Complete your quests.**

### 🚀 LifeRPG

**Your life is the adventure.
Your goals are the quests.
Your progress is the XP.
Your achievements are the rewards.**

### 👥 Team Members

* Team Member 1: Karishma G
* Team Member 2: Kamali M
* Team Member 3: Kaniga A
* Team Member 4: Manjusri R
