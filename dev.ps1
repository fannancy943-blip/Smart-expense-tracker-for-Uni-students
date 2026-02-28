# UniTracker - Start Development Servers

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  UniTracker - Development Mode" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Starting servers in new windows...`n" -ForegroundColor Yellow

# Start Backend
Write-Host "Backend:  npm run dev:backend" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$pwd'; npm run dev:backend`""

# Give backend time to start
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Frontend: npm run dev:frontend" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$pwd'; npm run dev:frontend`""

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Servers Starting..." -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Magenta
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host "`nOpen http://localhost:5173 in your browser`n" -ForegroundColor Cyan

Read-Host "Press Enter to close this window (servers keep running)"
