# 💰 AI Finance Assistant

An **AI-powered personal finance assistant** web app that helps users manage budgets, track expenses, and get AI-driven financial insights.  
Built with **Node.js + Express** for the backend, **lowdb** for database storage, and **JWT authentication**.  
Frontend is connected via REST API calls to fetch and process data.  

---

## 🚀 Features
- **User Authentication** – Secure login/signup using JWT & bcryptjs.
- **Expense Tracking** – Add, edit, delete expenses with categories and dates.
- **Budget Management** – Set monthly budgets and track progress.
- **AI Insights** – Get suggestions on saving and spending habits.
- **CSV Upload** – Upload bank statements for automatic expense categorization.
- **API Documentation** – Interactive Swagger UI for easy API testing.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**
- **lowdb** (Lightweight JSON database)
- **JWT** (Authentication)
- **Zod** (Data validation)
- **Multer** (File uploads)
- **Swagger** (API documentation)

### Frontend
- **React.js** (or any SPA framework)
- **Axios / Fetch API** (to connect with backend)
- **TailwindCSS / Bootstrap** for UI styling

### AI
- **OpenAI API** or similar AI service for financial insights  
  *(e.g., "How can I save more based on my spending history?")*

---

## 📂 Project Structure

```

## Deploy to Vercel

Monorepo with two projects (frontend and backend).

Backend (Node/Express → Serverless)
1) Root: `backend`
2) Build command: none
3) Output directory: (leave default)
4) Env vars:
   - `DATABASE_URL` (e.g., from Neon, include `?sslmode=require`)
   - `OPENAI_API_KEY` (optional)
   - `OPENAI_MODEL` (optional, default `gpt-4o-mini`)
5) Entry: `api/index.js` (Vercel auto-detects)

Frontend (Vite React)
1) Root: `frontend`
2) Build: `npm run build`
3) Output: `dist`
4) Env vars:
   - `VITE_API_BASE=https://<your-backend>.vercel.app`

Local dev
- Backend: `npm ci && npm run dev` in `backend` (requires Postgres)
- Frontend: `npm ci && npm run dev` in `frontend`
