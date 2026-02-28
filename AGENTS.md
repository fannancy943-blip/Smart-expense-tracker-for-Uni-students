# AGENTS.md - UniTracker Codebase Guide

## Build, Lint, Test Commands

### Backend (Node.js/Express)
- **Dev server**: `npm run dev` (from backend/ or root)
- **Start production**: `npm start`
- **Test**: No test suite configured (use `npm install --save-dev jest` to add)

### Frontend (React/Vite)
- **Dev server**: `npm run dev` (from frontend/)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Architecture & Codebase Structure

**UniTracker** is a full-stack expense tracking application for students.

- **Backend**: Express.js API (Node.js) with MySQL database
  - `backend/server.js` - Main Express app, routes config
  - `backend/db.js` - MySQL connection pool using mysql2
  - `backend/middleware/auth.js` - JWT authentication middleware
  - `backend/routes/` - API routes: auth, user, expenses, savings
  - Uses environment variables (.env) for DB and JWT_SECRET config

- **Frontend**: React 18 + Vite with Tailwind CSS
  - `frontend/src/` - React components
  - Uses axios for API calls to backend
  - Tailwind for styling

- **Database**: MySQL (`schema.sql`)
  - Tables: users, expenses, savings_goals
  - Supports user authentication, budget tracking, expense management, savings goals

## Code Style & Conventions

- **Language**: Backend is CommonJS (require/module.exports), Frontend is ES modules
- **Naming**: camelCase for variables/functions, snake_case for DB columns
- **Imports**: Backend uses `const module = require('module')`, Frontend uses `import`
- **Error Handling**: Try-catch blocks with HTTP status codes (401, 500 etc.)
- **Authentication**: JWT tokens in `Authorization: Bearer <token>` header
- **API Pattern**: `/api/<resource>` endpoints, JSON request/response bodies
- **Formatting**: Use spaces (no specific config found; follow existing style)
- **Validation**: express-validator for input validation on backend routes
