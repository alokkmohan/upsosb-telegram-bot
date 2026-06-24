#!/bin/bash

echo ""
echo " ========================================"
echo "  UPSOSB Telegram Bot Starting..."
echo " ========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo " [ERROR] Node.js nahi mila!"
    echo " Pehle install karo:"
    echo "   sudo apt update && sudo apt install -y nodejs npm"
    echo ""
    exit 1
fi

echo " Node.js mila: $(node --version)"

# Install dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo ""
    echo " Dependencies install ho rahi hain..."
    npm install
fi

echo ""
echo " Bot start ho raha hai..."
echo " Band karne ke liye: Ctrl+C dabao"
echo ""

node telegram-bot.js
