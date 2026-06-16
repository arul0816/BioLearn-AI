# 🎒 EduLearn AI – LLM-Based School Learning Companion

An AI-powered full-stack web application for school learners (School, UG, PG) that generates personalized study modules, adaptive quizzes, and intelligent recommendations for Math, Science, English, Social Studies, and more.

---

## 🚀 Features

- **AI-Generated Modules**: GPT-4 creates structured learning content with introduction, core concepts, diagram explanations, real-world applications, and summaries
- **Adaptive Quizzes**: Auto-generated MCQs (Easy/Medium/Hard) with instant evaluation
- **Adaptive Logic**:
  - < 50% → Revision module recommended
  - 50–80% → Medium-level practice recommended
  - > 80% → Advanced topics unlocked
- **Analytics Dashboard**: Mastery scores, performance graphs, time tracking, AI improvement suggestions
- **XP System**: Earn experience points for completing modules and quizzes
- **JWT Authentication**: Secure login/register with protected routes
- **Dark/Light Mode**: Toggle between themes
- **Animated Background**: School-friendly landing page with subtle motion and learning energy

---

## 🗂️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite, Tailwind CSS, Recharts, Framer Motion |
| Backend | Node.js, Express.js (MVC) |
| Database | MySQL + Sequelize ORM |
| AI | OpenAI GPT-4 API |
| Auth | JWT (JSON Web Tokens) + bcrypt |

---

## 📋 Prerequisites

- Node.js v18+
- MySQL 8.0+
- OpenAI API Key
- npm or yarn

---

## ⚙️ Installation & Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd edulearn-ai

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/edulearn-ai/database/schema.sql;
# or
mysql -u root -p < database/schema.sql
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cd server
cp .env.example .env

# Edit with your values
nano .env
```

Fill in:
- `DB_USER`, `DB_PASS` — your MySQL credentials
- `JWT_SECRET` — a random secret string (e.g., generate with `openssl rand -hex 32`)
- `OPENAI_API_KEY` — your OpenAI API key from https://platform.openai.com

### 4. Run the Application

```bash
# Start the backend server (from /server directory)
npm run dev

# In a new terminal, start the frontend (from /client directory)
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health check**: http://localhost:5000/api/health

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |

### Learning Modules
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/modules/generate` | Generate AI module |
| GET | `/api/modules` | Get all user modules |
| GET | `/api/modules/:id` | Get specific module |
| PUT | `/api/modules/:id/complete` | Mark module complete |
| DELETE | `/api/modules/:id` | Delete a module |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quizzes/generate` | Generate AI quiz |
| POST | `/api/quizzes/:id/submit` | Submit quiz answers |
| GET | `/api/quizzes` | Get all user quizzes |
| GET | `/api/quizzes/:id` | Get specific quiz |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Get analytics overview |
| GET | `/api/analytics/suggestions` | Get AI learning suggestions |
| GET | `/api/analytics/topics` | Get topic mastery data |

---

## 🗃️ Database Schema

```
users (id, name, email, password, role, level, total_xp, streak, ...)
  ├── modules (id, user_id→, topic, level, content, mastery_score, ...)
  │     └── quizzes (id, user_id→, module_id→, topic, difficulty, ...)
  │           └── questions (id, quiz_id→, question_text, options, correct_answer, ...)
  └── progress (id, user_id→, module_id→, quiz_id→, action, score, ...)
```

---

## 📦 Production Deployment

### Backend (PM2)
```bash
npm install -g pm2
cd server
NODE_ENV=production pm2 start server.js --name edulearn-api
pm2 save && pm2 startup
```

### Frontend (Build)
```bash
cd client
npm run build
# Deploy /client/dist to your web server (Nginx, Apache, Vercel, Netlify)
```

### Nginx Configuration (Example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend
    location / {
        root /var/www/edulearn/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

---

## 🔒 Security Features

- JWT token authentication with expiry
- Password hashing with bcrypt (salt rounds: 12)
- Rate limiting (100 req/15min general, 10 req/min for AI endpoints)
- CORS configured for specific origins
- Helmet.js security headers
- Input validation and sanitization

---

## 📁 Project Structure

```
edulearn-ai/
├── client/                     # React Frontend (Vite)
│   └── src/
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route page components
│       ├── services/           # API service modules
│       ├── context/            # React context (Auth, Theme)
│       └── App.jsx
├── server/                     # Node.js Backend
│   ├── config/                 # DB + OpenAI config
│   ├── models/                 # Sequelize ORM models
│   ├── controllers/            # Request handlers
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Auth + Error middleware
│   ├── utils/                  # Adaptive logic utilities
│   └── server.js
└── database/
    └── schema.sql              # MySQL schema
```

---

## 🧠 Adaptive Learning Algorithm

```javascript
if (score < 50%) → type: 'revision'    → generate revision module
if (score 50-80%) → type: 'practice'   → medium difficulty quiz
if (score > 80%) → type: 'advance'    → unlock advanced topics + Hard difficulty
```

XP Rewards: Easy(10), Medium(20), Hard(35) × performance multiplier × first-attempt bonus

---

## 📄 License

MIT License - Free to use for educational purposes.

---

Built with ❤️ for school learners everywhere 🎓
