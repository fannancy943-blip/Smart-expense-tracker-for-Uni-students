# UniTracker - Setup Script for PowerShell

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  UniTracker - Quick Start" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Step 1: Install dependencies
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Yellow
npm run install:all

# Step 2: Setup database
Write-Host "`nStep 2: Setting up database..." -ForegroundColor Yellow
Set-Location backend
node scripts/setup-db.js
Set-Location ..

# Completion message
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure MySQL is running" -ForegroundColor White
Write-Host "2. Open two terminals and run:" -ForegroundColor White
Write-Host "   - Terminal 1: npm run dev:backend" -ForegroundColor Magenta
Write-Host "   - Terminal 2: npm run dev:frontend" -ForegroundColor Magenta
Write-Host "`nOr run both together:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Magenta
Write-Host "`nThen open: http://localhost:5173`n" -ForegroundColor Green

Read-Host "Press Enter to close"
