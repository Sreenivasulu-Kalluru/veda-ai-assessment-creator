# VedaAI Assessment Creator

VedaAI is a full-stack, real-time web application that allows teachers to effortlessly generate high-quality question papers using Artificial Intelligence. Built as a monorepo, it features a modern Next.js frontend and a robust Node.js backend powered by Google's Gemini AI, MongoDB, and Redis-backed task queues.

## 🌟 Key Features
- **AI-Powered Generation:** Leverages Google's Gemini LLM to instantly generate structured question papers based on topic, total marks, and specific question types.
- **Contextual File Uploads:** Upload `.txt` files to provide context or source material directly to the AI for generation.
- **Real-time Updates:** Uses `Socket.io` to provide real-time status updates (Processing, Completed, Failed) to the client without page refreshes.
- **Background Processing:** Heavy AI prompts are offloaded to a background worker queue (`BullMQ`) to ensure the server remains responsive and never times out.
- **Native PDF Export:** Beautifully formats the generated assignment into a traditional "Exam Paper" layout and uses browser-native printing to download as a clean PDF.
- **Mobile Responsive:** A completely responsive UI that works flawlessly on mobile devices, tablets, and desktop monitors.

## 🛠 Tech Stack
- **Frontend:** Next.js (App Router), React, Zustand (State Management), Socket.io-client, Vanilla CSS (CSS Modules).
- **Backend:** Node.js, Express.js, TypeScript, Mongoose (MongoDB).
- **AI & Workers:** Google Gemini API (`@google/genai`), BullMQ, Redis.

## 📂 Project Structure
This project is structured as a Monorepo:
- `/client` - Contains the Next.js frontend application.
- `/server` - Contains the Express.js backend API and worker processes.

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v18+)
- MongoDB (Running locally on port `27017` or a MongoDB Atlas URI)
- Redis (Running locally on port `6379` or an Upstash Redis URL)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd veda-ai
```

### 2. Set up the Backend (`/server`)
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/veda-ai
   REDIS_URL=redis://127.0.0.1:6379
   GEMINI_API_KEY=your_google_gemini_api_key_here
   CLIENT_URL=http://localhost:3000
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Set up the Frontend (`/client`)
1. Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
2. Create a `.env.local` file in the `client` directory (optional for local dev if backend is on port 5000):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

---
