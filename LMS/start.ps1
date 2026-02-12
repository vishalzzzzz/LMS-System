# Smart Library Borrowing System - PowerShell Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Smart Library Borrowing System" -ForegroundColor Green
Write-Host "  Starting Backend and Frontend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing processes on ports
Write-Host "Checking for existing processes on ports 5000 and 5173..." -ForegroundColor Yellow
$backend = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($backend) {
    Stop-Process -Id $backend -Force
    Write-Host "✓ Killed existing process on port 5000" -ForegroundColor Green
}

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers are starting..." -ForegroundColor Green
Write-Host "  Backend: http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting for servers to fully start..." -ForegroundColor Yellow

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✓ Opening application in browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Application is ready!" -ForegroundColor Green
Write-Host "  To stop servers, close the terminal windows" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
