# UniTracker Setup Guide

## Step 1: Start MySQL Server

### Option A: MySQL from Command Line (if installed)
```bash
mysql -u root -p
```

### Option B: Using Docker (Recommended)
```bash
docker-compose up -d db
```

## Step 2: Configure Environment Variables

Create `.env` file in the **backend** folder with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=unitracker
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Step 3: Create Database

### Option A: Using MySQL Command
```bash
mysql -u root -p < schema.sql
```

### Option B: Using Docker
```bash
docker exec unitracker-db mysql -u root -prootpassword < schema.sql
```

## Step 4: Install Dependencies

```bash
npm run install:all
```

## Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
Expected output: "✅ Server ready to accept connections"

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
Expected output: "VITE ready in XXX ms"

## Step 6: Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Troubleshooting

### MySQL Connection Error (ER_ACCESS_DENIED_ERROR)

1. **Check if MySQL is running:**
   ```bash
   # On Windows
   netstat -ano | findstr :3306
   ```

2. **Verify credentials in `.env`:**
   - Test connection manually:
   ```bash
   mysql -h localhost -u root -pYourPassword
   ```

3. **Reset MySQL password (if needed):**
   - Stop MySQL
   - Start with `--skip-grant-tables`
   - Reset password

4. **Use Docker instead:**
   ```bash
   docker-compose up
   ```

### Port Already in Use

Change ports in `.env` and frontend vite.config.js

### Node Modules Issues

```bash
rm -r node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## Production Deployment

### Using Docker:
```bash
docker-compose -f docker-compose.yml up --build
```

### Manual:
```bash
npm run build
NODE_ENV=production npm start
```

App will be at http://localhost:5000
