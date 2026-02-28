@echo off
echo.
echo ========================================
echo   UniTracker - Quick Start
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm run install:all

echo.
echo Step 2: Setting up database...
cd backend
call node scripts/setup-db.js
cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Start development:
echo - Backend: npm run dev:backend
echo - Frontend: npm run dev:frontend
echo.
echo Or run both: npm run dev
echo.
pause
