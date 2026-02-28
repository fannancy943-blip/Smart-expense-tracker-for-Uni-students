# UniTracker - Quick Start (Windows)

## ⚡ 30-Second Setup

### 1. Install & Setup (Run Once)
```bash
./start.bat
```

This will:
- Install all dependencies
- Create MySQL database
- Set up tables

### 2. Run Development Servers
```bash
./dev.bat
```

Or manually:
```bash
# Terminal 1
npm run dev:backend

# Terminal 2  
npm run dev:frontend
```

### 3. Open in Browser
```
http://localhost:5173
```

---

## 🔧 If MySQL Connection Fails

### Check MySQL Status
```powershell
Get-Service | Where-Object {$_.Name -like '*MySQL*'}
```

### Start MySQL (if using Windows Service)
```powershell
Start-Service MySQL80
```

### Or Use Docker
```bash
docker run --name unitracker-db -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.0
```

---

## 📝 First Time Configuration

### Create backend/.env
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=unitracker
JWT_SECRET=dev-secret-key-change-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Create frontend/.env.local
```
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Verify Setup

1. **Backend Health Check:**
   ```
   curl http://localhost:5000/api/health
   ```
   Expected response: `{"status":"OK",...}`

2. **Frontend Running:**
   ```
   http://localhost:5173
   ```
   Should show login page

3. **Test API:**
   ```bash
   # Terminal
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"password123"}'
   ```

---

## 🚀 Production Build

### Single Server (Frontend + Backend)
```bash
npm run build
NODE_ENV=production npm start
```
Then visit `http://localhost:5000`

### Using Docker
```bash
docker-compose up --build
```
Then visit `http://localhost:5000`

---

## 📚 File Structure

```
DEEPpj/
├── backend/              # Node.js Express API
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Main server
│   └── db.js           # MySQL pool
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── api/        # API calls
│   │   └── main.jsx    # Entry point
│   └── dist/           # Built files (production)
├── schema.sql          # Database schema
├── Dockerfile          # Container image
├── docker-compose.yml  # Multi-container setup
├── start.bat           # Automated setup
└── dev.bat            # Start dev servers
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `ER_ACCESS_DENIED_ERROR` | Check .env credentials, start MySQL |
| `EADDRINUSE: port 5000 in use` | `netstat -ano \| findstr :5000` to find & kill process |
| `Cannot GET /` | Make sure frontend is built or dev server running |
| `CORS Error` | Check FRONTEND_URL in backend .env |
| `Module not found` | Run `npm run install:all` |

---

## 🔑 Default Test User (After Setup)

Register in UI with:
- Email: `test@example.com`
- Password: `password123`

---

## 📖 Full Documentation

See `README.md` for complete setup, API docs, and deployment guides.
