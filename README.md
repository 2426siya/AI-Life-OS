# NexusOS 🚀
### AI-Powered Life & Goal Optimization Platform

NexusOS is an intelligent, energy-aware career planner and personal optimizer designed for engineers and students. It automatically decomposes high-level goals into milestones and daily tasks, schedules them based on your daily energy rhythm, and integrates in real-time with Google Calendar and GitHub to keep you on track.

---

## 🌟 Key Features

* **Goal Engine & AI Roadmapping**: Define high-level goals (e.g., *Get selected for GSoC 2027*, *Germany Master's Application*), and the AI automatically decomposes them into weekly milestones and chronological tasks.
* **Energy-Based Smart Planner**: Groups daily tasks into **Morning (High)**, **Afternoon (Medium)**, and **Night (Low)** blocks matching your natural peak productivity timings.
* **Prerequisite Lockouts**: Visual task locks prevent you from starting a task until its prerequisites are completed.
* **Manual Task Manager**: Easily add custom one-off tasks to your planner and link them to existing goals/milestones.
* **Google Calendar Sync**: Integrates with Google Calendar via OAuth 2.0. Syncs your meetings, classes, and events directly into your daily blocks with auto-refreshing background tokens.
* **GitHub Integration**: Connects to the public GitHub API (using your username like `2426siya`) to track real-time commits, open PRs, solved issues, and weekly contributions.
* **AI Mentor & Context Memory**: A chat assistant that remembers your goals, checks your progress, and automatically creates recovery plans if you get overloaded.
* **Portfolio Generator**: Dynamically updates your professional engineering portfolio based on goals you complete.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons, Vite
* **Backend**: FastAPI (Python), SQLAlchemy ORM, Uvicorn, Bcrypt, HTTPX
* **Database**: PostgreSQL (Production / Supabase), SQLite (Local development)

---

## 🚀 Installation & Local Setup

### Prerequisites
* Python 3.10+
* Node.js (v18+)

### 1. Backend Setup
1. Open a terminal in the root folder.
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Frontend Setup
1. Open a new terminal in the `frontend` directory.
2. Install Node modules:
   ```bash
   npm install
   ```

### 3. Run the Application
From the workspace root, run the pre-configured launcher:
```bash
# Double-click or run from cmd:
launch.bat
```
This automatically boots up the FastAPI backend on port `8000`, the React dev server on port `5173`, and opens the website in your default browser.

---

## 🔑 Environment Configuration

For full production functionality (Google Calendar and Supabase DB), set the following environment variables in your hosting environment (e.g., Render):

| Environment Variable | Description |
|---|---|
| `DATABASE_URL` | Production PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Web Client Secret from Google Cloud Console |

---

## 🤝 Contributing
* Sync your website registration username with your **exact GitHub handle** (e.g., `2426siya`) to automatically pull your real contributions feed.
* When registering Google OAuth redirect URIs, make sure to add:
  `https://your-domain.com/api/integrations/calendar/callback`
