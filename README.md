# acedit

Acedit.ai is an AI-powered interview preparation platform that helps you create role-specific practice sessions, generate focused questions, and get concise explanations. It keeps interview prep structured, fast, and distraction-free.

## Features
- User authentication with JWT
- Create interview sessions by role, experience, and topics
- AI-generated question sets (Gemini)
- On-demand explanations for any question
- Pin important questions for quick review
- Clean, focused UI with light/dark theme support

## Tech Stack
- Frontend: React + Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT + bcrypt
- AI: Google Gemini via `@google/genai`

## Project Structure
- `backend/` Express API, MongoDB models, AI integration
- `frontend/` React client (Vite)

## Requirements
- Node.js 18+ (recommended)
- MongoDB connection string
- Google Gemini API key

## Environment Variables
Create `backend/.env` based on `backend/.env.example`:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=9001
```

## Setup and Run

### 1) Backend
```
cd backend
npm install
npm run dev
```
The API runs on `http://localhost:9001`.

### 2) Frontend
```
cd frontend
npm install
npm run dev
```
The app runs on `http://localhost:5173`.

## API Overview
Base URL: `http://localhost:9001`

Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/profile` (placeholder)

Sessions
- `POST /api/sessions/create`
- `GET /api/sessions/my-sessions`
- `GET /api/sessions/:id`
- `DELETE /api/sessions/:id`

AI
- `POST /api/ai/generate-questions`
- `POST /api/ai/generate-explanation`

Questions
- `PATCH /api/questions/:id/pin`

## Notes
- `backend/.env` is intentionally ignored in `.gitignore` to keep secrets safe.
- CORS is configured for `http://localhost:5173` in the backend.

## Screens / Pages
- Landing page with AI-focused messaging and hero animation
<img width="1427" height="840" alt="image" src="https://github.com/user-attachments/assets/647adaf1-01a5-4c7a-b17c-36d71d8dfdc6" />

- Auth pages (login, signup)
<img width="608" height="619" alt="image" src="https://github.com/user-attachments/assets/488da21a-7897-4ef9-a51f-0cb37a6a59d8" />

- Dashboard to manage sessions
<img width="1147" height="806" alt="image" src="https://github.com/user-attachments/assets/d1843700-63c2-4cf7-a56c-2e12948c9cf1" />

- Interview prep view with questions, explanations, and pinning
<img width="1142" height="819" alt="image" src="https://github.com/user-attachments/assets/7a59cc1d-d0ca-4237-ad81-3bea5a015fff" />

