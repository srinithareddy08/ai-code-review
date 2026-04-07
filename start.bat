@echo off
echo ========================================
echo    AI Code Review Assistant - Startup
echo ========================================
echo.

echo [1/2] Starting MongoDB...
start "MongoDB" cmd /k "mongod"
timeout /t 3 /nobreak > nul

echo [2/2] Starting Backend Server...
start "Backend" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo  Backend is running on port 5000!
echo  Opening your app now...
echo ========================================
echo.

start "" "%~dp0Frontend\index.html"