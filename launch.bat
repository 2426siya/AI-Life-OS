@echo off
echo Starting Nexus AI Life Operating System...

:: Launch Backend
echo Launching FastAPI Backend...
start "Nexus Backend" cmd /k "cd /d C:\Users\Sunil Kale\.gemini\antigravity\scratch && .venv\Scripts\uvicorn.exe backend.main:app --host 127.0.0.1 --port 8000"

:: Launch Frontend
echo Launching React Frontend...
start "Nexus Frontend" cmd /k "cd /d C:\Users\Sunil Kale\.gemini\antigravity\scratch\frontend && npm run dev"

:: Wait for servers to spin up
echo Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

:: Open browser
echo Launching web app in browser...
start http://localhost:5173

echo Done! Feel free to minimize the command prompts (do not close them).
exit
