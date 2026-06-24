@echo off
title UPSOSB Bot - First Time Setup
color 0A
cls

echo.
echo  =====================================================
echo   UPSOSB Bot - Install aur Setup
echo  =====================================================
echo.

:: Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Node.js install nahi hai!
    echo.
    echo  Pehle Node.js download karein:
    echo  https://nodejs.org  (LTS version)
    echo.
    echo  Install karne ke baad yeh file dobara chalayein.
    echo.
    pause
    start https://nodejs.org
    exit
)

echo  [OK] Node.js mila:
node -v
echo.

:: Install dependencies
echo  [1/3] Dependencies install ho rahi hain...
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] npm install fail ho gaya!
    pause
    exit
)
echo  [OK] Dependencies ready!
echo.

:: Create data folder and seed database
echo  [2/3] Database setup ho raha hai...
if not exist "data" mkdir data
node seed.js
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Database seed fail ho gaya!
    pause
    exit
)
echo  [OK] Database ready!
echo.

:: Start both servers
echo  [3/3] Bot aur Admin Portal start ho rahe hain...
echo.

start "UPSOSB Admin Portal" cmd /k "title Admin Portal (Port 3000) && node server.js"
timeout /t 2 /nobreak >nul

start "UPSOSB Telegram Bot" cmd /k "title Telegram Bot && node telegram-bot.js"
timeout /t 3 /nobreak >nul

:: Open browser
start http://localhost:3000

echo.
echo  =====================================================
echo   Setup Complete!
echo  =====================================================
echo.
echo   Admin Portal : http://localhost:3000
echo   Password     : admin123
echo.
echo   Dono windows band mat karein — bot band ho jayega.
echo.
echo   Agle baar sirf "start.bat" chalayein.
echo.
pause
