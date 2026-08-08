@echo off
echo =================================───────────────────────────
echo           STARTING DEFECTIQ PLATFORM SERVICES
echo =================================───────────────────────────

start "DefectIQ Python ML API (Port 8000)" cmd /k "cd /d %~dp0ml_service && python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload"

start "DefectIQ Node.js Backend API (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

start "DefectIQ React Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npx vite --host 127.0.0.1 --port 3000"

echo.
echo All 3 services are launching in separate terminal windows!
echo Opening http://127.0.0.1:3000 in browser...
start http://127.0.0.1:3000
