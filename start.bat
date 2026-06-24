@echo off
title UPSOSB Telegram Bot
color 0A
echo.
echo  ========================================
echo   UPSOSB Telegram Bot Starting...
echo  ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js nahi mila!
    echo  Pehle Node.js install karo: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo  Node.js mila:
node --version

:: Install dependencies if node_modules missing
if not exist "node_modules" (
    echo.
    echo  Dependencies install ho rahi hain...
    npm install
)

echo.
echo  Bot start ho raha hai...
echo  Band karne ke liye: Ctrl+C dabao
echo.

node telegram-bot.js

echo.
echo  Bot band ho gaya.
pause
