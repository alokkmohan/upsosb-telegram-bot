@echo off
title UPSOSB Bot + Admin Portal
color 0A
echo.
echo  ================================================
echo   UPSOSB Bot + Admin Portal Starting...
echo  ================================================
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js nahi mila! https://nodejs.org se install karein.
  pause & exit /b 1
)

if not exist "node_modules\express" (
  echo  Dependencies install ho rahi hain...
  npm install
  echo.
)

echo  Admin Portal shuru ho raha hai (port 3000)...
start "Admin Portal" cmd /k "node server.js"

timeout /t 2 >nul

echo  Telegram Bot shuru ho raha hai...
start "Telegram Bot" cmd /k "node telegram-bot.js"

echo.
echo  ================================================
echo   Dono shuru ho gaye!
echo.
echo   Admin Portal : http://localhost:3000
echo   Bot          : Telegram par active hai
echo.
echo   Band karne ke liye dono windows close karein.
echo  ================================================
echo.
pause
