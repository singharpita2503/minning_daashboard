@echo off
echo ========================================
echo Starting Mining Dashboard in DEV MODE
echo ========================================
echo.
echo Starting Backend Server (Port 5000)...
echo Starting Frontend Dev Server (Port 3000)...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

start "Backend Server" cmd /k "cd backend && python app.py"
timeout /t 2 /nobreak >nul
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Check the new windows for server output
echo.
pause


