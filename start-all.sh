#!/bin/bash
echo ""
echo " ================================================"
echo "  UPSOSB Bot + Admin Portal Starting..."
echo " ================================================"
echo ""

if ! command -v node &>/dev/null; then
  echo " [ERROR] Node.js nahi mila!"
  echo " Install karein: sudo apt update && sudo apt install -y nodejs npm"
  exit 1
fi

if [ ! -d "node_modules/express" ]; then
  echo " Dependencies install ho rahi hain..."
  npm install
  echo ""
fi

echo " Admin Portal shuru ho raha hai (port 3000)..."
node server.js &
ADMIN_PID=$!

sleep 1

echo " Telegram Bot shuru ho raha hai..."
node telegram-bot.js &
BOT_PID=$!

echo ""
echo " ================================================"
echo "  Dono shuru ho gaye!"
echo ""
echo "  Admin Portal : http://localhost:3000"
echo "  Bot          : Telegram par active hai"
echo ""
echo "  Band karne ke liye: Ctrl+C dabao"
echo " ================================================"
echo ""

trap "kill $ADMIN_PID $BOT_PID 2>/dev/null; echo 'Band ho gaya.'" INT TERM
wait
