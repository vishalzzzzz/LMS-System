@echo off
echo ========================================
echo   Smart Library Borrowing System
echo   Starting Backend and Frontend...
echo ========================================
echo.

REM Start Backend in a new window
start "LMS Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Frontend in a new window
start "LMS Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Servers are starting...
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to open the application in your browser...
pause >nul

start http://localhost:5173

echo.
echo To stop the servers, close the Backend and Frontend windows.
echo.
