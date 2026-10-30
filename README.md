# 🛡️ ScamShield AI
**Job Scam Detection & Awareness Platform**

> Protecting Indian job seekers from financial fraud using AI-powered scam detection, behavioral analysis, and community intelligence.

---

## 🚀 Live Demo
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`
- Database: MongoDB Atlas (cloud)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Job Scam Analyzer** | Paste job post, chat, or upload offer letter — instant risk score |
| 🧬 **Scam DNA** | Behavioral manipulation pattern detection (urgency, authority, isolation) |
| 🔗 **Link Inspector** | Suspicious URL analysis — phishing, typosquatting, bad TLDs |
| 🏢 **Company Verify** | CIN validation + known company registry check |
| 📡 **Scam Radar** | Community-submitted scam reports with upvoting |
| 🗄️ **Evidence Locker** | Secure file upload for screenshots/PDFs |
| 🤖 **AI Safety Coach** | Interactive Q&A chatbot for scam awareness |
| 📊 **Live Dashboard** | Real-time stats from MongoDB Atlas |
| 🚨 **Report System** | Submit scam reports — stored in cloud database |
| 📚 **Scam Intelligence** | 6 detailed scam pattern guides |

---

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite 8 (build tool)
- Tailwind CSS v3
- Recharts (data visualization)
- React Router DOM

### Backend
- Node.js + Express 4
- TypeScript
- MongoDB Atlas (mongoose)
- Helmet.js (security headers)
- express-rate-limit (DDoS protection)
- multer (file uploads)
- ts-node-dev (hot reload)

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)

### 1. Clone & Install

```bash
# Frontend dependencies
cd ScamShield-AI
npm install

# Backend dependencies
cd backend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/scamshield?retryWrites=true&w=majority
```

### 3. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd ..
npm run dev
```

Open: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/analyze` | Scam detection scan |
| POST | `/api/verify` | Company verification |
| POST | `/api/report` | Submit scam report |
| GET | `/api/reports` | All submitted reports |
| GET | `/api/dashboard/stats` | Live scan statistics |
| GET | `/api/dashboard/weekly` | Weekly chart data |
| GET | `/api/dashboard/history` | Last 20 scan records |
| GET | `/api/intelligence/patterns` | 6 scam patterns |
| POST | `/api/dna` | Behavioral analysis |
| POST | `/api/links` | URL inspection |
| POST | `/api/evidence/upload` | Upload evidence file |
| GET | `/api/radar` | Community reports |
| POST | `/api/radar/submit` | Submit radar report |
| POST | `/api/coach` | AI safety coach Q&A |

---

## 🔒 Security Features
- **Helmet.js** — XSS, clickjacking, MIME-type protection headers
- **Rate Limiting** — 200 req/15 min global, 30 scans/5 min for analyze
- **Input Sanitization** — HTML tag stripping on all request bodies
- **CORS** — Restricted to frontend origin only
- **Body Size Limit** — 1MB max request size
- **MongoDB Atlas** — Cloud database with IP whitelist

---

## 🗃️ Database Collections (MongoDB Atlas)

| Collection | Stores |
|------------|--------|
| `scanrecords` | Every scam analysis result |
| `reports` | User-submitted scam reports |
| `radarreports` | Community radar submissions |
| `evidencefiles` | Uploaded evidence metadata |

---

## 🚨 Emergency Contacts
- **Cybercrime Helpline:** 1930 (24/7)
- **Official Portal:** [cybercrime.gov.in](https://cybercrime.gov.in)

---

*Built for hackathon — Protecting India's job seekers from financial fraud.*
