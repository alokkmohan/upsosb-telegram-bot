@echo off
title UPSOSB Bot - Start
color 0A
cls

echo.
echo  =====================================================
echo   UPSOSB Bot - Starting...
echo  =====================================================
echo.

:: Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo  [ERROR] Node.js install nahi hai!
    echo  Pehle install.bat chalayein.
    pause
    exit
)

:: Check node_modules
if not exist "node_modules" (
    echo  [INFO] Dependencies nahi mili, install ho rahi hain...
    call npm install
)

:: Check database
if not exist "data\menus.json" (
    echo  [INFO] Database nahi mila, setup ho raha hai...
    if not exist "data" mkdir data
    node seed.js
)

echo  [1/2] Admin Portal start ho raha hai...
start "UPSOSB Admin Portal" cmd /k "title Admin Portal (Port 3000) && node server.js"
timeout /t 2 /nobreak >nul

echo  [2/2] Telegram Bot start ho raha hai...
start "UPSOSB Telegram Bot" cmd /k "title Telegram Bot && node telegram-bot.js"
timeout /t 3 /nobreak >nul

start http://localhost:3000

echo.
echo  =====================================================
echo   Bot chal raha hai!
echo  =====================================================
echo.
echo   Admin Portal : http://localhost:3000
echo   Password     : admin123
echo.
echo   NOTE: Dono kali windows band mat karein.
echo         Band karni ho to pehle bot band karein.
echo.
pause
