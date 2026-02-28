@echo off
echo.
echo ========================================
echo   UniTracker - Development Mode
echo ========================================
echo.

REM Start both servers in parallel
start "UniTracker Backend" cmd /k "npm run dev:backend"
start "UniTracker Frontend" cmd /k "npm run dev:frontend"

echo.
echo Servers starting...
echo Backend: http://localhost:5000/api
echo Frontend: http://localhost:5173
echo.
