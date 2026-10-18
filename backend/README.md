# Heritage Storyteller - Flask Backend & Database

This is the Python Flask REST API backend and PostgreSQL database for **Heritage Storyteller**, an interactive Indian heritage learning platform.

---

## 🛕 Tech Stack

- **Backend**: Python 3.13, Flask 3.1
- **ORM**: SQLAlchemy 2.1
- **Database**: PostgreSQL (`heritage_storyteller`)
- **Authentication**: Flask-JWT-Extended (JWT Bearer Tokens)
- **Password Hashing**: Werkzeug Security (`generate_password_hash`, `check_password_hash`)
- **CORS**: Flask-CORS
- **Environment Management**: Python-dotenv

---

## 📁 Backend Directory Structure

```
backend/
├── app.py                     # Flask App Factory & Server Entrypoint
├── config.py                  # Database & JWT Configuration
├── extensions.py              # Flask Extension Instances (db, jwt, cors)
├── requirements.txt           # Python Dependencies
├── .env                       # Environment Variables
├── .env.example               # Template for Environment Variables
├── models/                    # SQLAlchemy ORM Data Models
│   ├── __init__.py
│   ├── user.py                # Users Table
│   ├── heritage_topic.py      # Heritage Topics Table
│   ├── story_chapter.py       # Story Chapters Table
│   ├── quiz.py                # Quiz Questions & Quiz Results Tables
│   ├── game.py                # Game Items Table (Artifact Match & Memory)
│   ├── progress.py            # User Progress Table
│   └── achievement.py         # Achievements & User Achievements Tables
├── routes/                    # Flask REST API Blueprints
│   ├── __init__.py
│   ├── auth.py                # Register, Login, Me Endpoints
│   ├── topics.py              # GET, POST, PUT, DELETE Heritage Topics
│   ├── stories.py             # GET, POST, PUT, DELETE Chapters & Complete Story
│   ├── quizzes.py             # GET Quiz Questions & Submit Quiz
│   ├── games.py               # GET & Submit Artifact Match & Memory Games
│   ├── progress.py            # User Progress & Dashboard APIs
│   └── admin.py               # Admin Management & Platform Statistics
├── services/                  # Business Logic Services
│   ├── __init__.py
│   ├── xp_service.py          # Centralized award_xp() Logic
│   ├── achievement_service.py # Automatic Badge Unlocking Logic
│   └── progress_service.py    # User Progress Helper Logic
├── utils/                     # Authentication & Authorization Helpers
│   └── auth_utils.py          # @admin_required Decorator
├── seed/                      # Database Seeding Script
│   └── seed_data.py           # Populates 5 topics, chapters, quizzes, games & users
└── tests/                     # Automated Test Suite
    └── test_api.py            # End-to-End REST API Integration Tests
```

---

## 🚀 Setup & Installation Commands

### 1. Prerequisites
- Python 3.10+ installed
- PostgreSQL 14+ installed and running

### 2. Create PostgreSQL Database
Open PostgreSQL shell (`psql`) or pgAdmin and run:
```sql
CREATE DATABASE heritage_storyteller;
```

### 3. Install Dependencies
Navigate to project root directory:
```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` in the `backend/` folder and configure your local credentials:
```ini
SECRET_KEY=your_flask_secret_key_here
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/heritage_storyteller
JWT_SECRET_KEY=your_jwt_secret_key_here
PORT=5000
```

### 5. Seed Database
Run the seed script to create all tables and populate the 5 core heritage topics (Warli Art, Ajanta Caves, Maratha Forts, Paithani, Lavani) along with chapters, quizzes, games, achievements, and admin user:
```bash
python backend/seed/seed_data.py
```

### 6. Run Automated API Integration Tests
Verify all API endpoints, authentication, XP awards, and achievement checking:
```bash
python backend/tests/test_api.py
```

### 7. Start Flask REST API Server
```bash
python backend/app.py
```
The server will run on `http://localhost:5000`.

---

## 🔑 Default User Credentials

| Role | Email | Password | Initial XP |
|------|-------|----------|------------|
| **Admin** | `admin@heritage.com` | `admin123` | 1000 XP |
| **Student User** | `pratima@gmail.com` | `password123` | 320 XP |

---

## 📡 Key REST API Endpoints Overview

| Category | Method | Endpoint | Access | Description |
|----------|--------|----------|--------|-------------|
| **Auth** | POST | `/api/auth/register` | Public | Register new user account |
| **Auth** | POST | `/api/auth/login` | Public | Authenticate user & get JWT token |
| **Auth** | GET | `/api/auth/me` | User | Get logged-in user profile & XP |
| **Topics** | GET | `/api/topics` | Public | Get all topics (filters: `category`, `state`, `search`) |
| **Topics** | GET | `/api/topics/<id>` | Public | Get topic details with chapters & quiz count |
| **Topics** | POST | `/api/topics` | Admin | Create a new heritage topic |
| **Topics** | PUT | `/api/topics/<id>` | Admin | Update a heritage topic |
| **Topics** | DELETE | `/api/topics/<id>` | Admin | Delete a heritage topic |
| **Stories** | GET | `/api/topics/<topic_id>/chapters` | Public | Get chapters ordered by chapter_number |
| **Stories** | POST | `/api/topics/<topic_id>/complete-story` | User | Mark story completed & earn +20 XP |
| **Quizzes** | GET | `/api/topics/<topic_id>/quiz` | Public | Get quiz questions (answers hidden) |
| **Quizzes** | POST | `/api/topics/<topic_id>/quiz/submit` | User | Submit answers, calculate score, award XP & badges |
| **Games** | GET | `/api/games/artifact-match/<topic_id>` | Public | Get Artifact Match game items |
| **Games** | POST | `/api/games/artifact-match/<topic_id>/submit` | User | Submit score, award +30 XP & update progress |
| **Games** | GET | `/api/games/memory/<topic_id>` | Public | Get Memory game card pairs |
| **Games** | POST | `/api/games/memory/<topic_id>/submit` | User | Submit score, award +30 XP & update progress |
| **Progress**| GET | `/api/progress` | User | Get all topic progress for user |
| **Progress**| GET | `/api/dashboard` | User | Get user stats (total XP, stories, quizzes, games, badges) |
| **Admin** | GET | `/api/admin/dashboard` | Admin | Platform statistics (users, topics, stories, quizzes, popular topics) |
| **Admin** | GET | `/api/admin/users` | Admin | List all registered users |
