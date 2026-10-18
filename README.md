# 🛕 Heritage Storyteller

**Heritage Storyteller** is an interactive Indian heritage learning platform where users discover, listen, learn, quiz, play, and earn cultural achievements.

---

## 📁 Project Structure

```text
Heritage Storyteller/
├── frontend/                  # React + Vite Interactive Frontend Application
│   ├── public/                # Static public assets
│   ├── src/                   # React components, pages, context, and CSS
│   ├── index.html             # Single-Page App HTML entrypoint
│   ├── vite.config.js         # Vite configuration
│   ├── package.json           # Frontend npm dependencies
│   └── package-lock.json
│
├── backend/                   # Python Flask REST API & PostgreSQL Database
│   ├── app.py                 # Flask App Factory & server entrypoint
│   ├── config.py              # App & DB configuration
│   ├── extensions.py          # SQLAlchemy, JWT & CORS setup
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   ├── models/                # SQLAlchemy ORM Data Models
│   ├── routes/                # REST API Endpoint Blueprints
│   ├── services/              # Business logic (XP & Achievements)
│   ├── seed/                  # Database seed script (5 topics, quizzes, games)
│   └── tests/                 # Automated API test suite
│
└── README.md                  # Project Documentation
```

---

## 🚀 Running the Application

### 1. Frontend Setup (React + Vite)

Navigating to the `frontend/` folder:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will start at `http://localhost:5173`.

### 2. Backend Setup (Flask + PostgreSQL)

Navigating to the `backend/` folder:

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Seed the PostgreSQL database (heritage_storyteller)
python seed/seed_data.py

# Run backend API server
python app.py
```

The REST API backend will run on `http://localhost:5000`.

---

## 🎯 Features

- **Interactive Visual Stories**: Rich story chapters on Warli Art, Ajanta Caves, Maratha Forts, Paithani, and Lavani.
- **Cultural Quizzes**: Topic-specific quizzes with instant scoring and explanations.
- **Interactive Mini-Games**: Artifact Match and Heritage Memory card games.
- **XP & Achievement Rewards**: Centralized gamified XP system with automatic badge unlocking.
- **User & Admin Dashboards**: Role-based authentication (User / Admin) and statistics tracking.
