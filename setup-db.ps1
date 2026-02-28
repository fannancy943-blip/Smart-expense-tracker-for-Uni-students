# UniTracker - Database Setup

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Database Setup" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Set-Location backend
node scripts/setup-db.js
Set-Location ..

Write-Host "`nDatabase setup complete!`n" -ForegroundColor Green
Read-Host "Press Enter to close"
