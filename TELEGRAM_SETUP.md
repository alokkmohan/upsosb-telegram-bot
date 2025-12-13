# 🤖 Telegram Bot Setup Instructions

## Step 1: Bot Token Lena

1. Telegram app kholo
2. Search karo: **@BotFather**
3. Start karo aur type karo: `/newbot`
4. Bot ka naam do (Example: "My Education Bot")
5. Bot ka username do (Example: "my_education_bot")
6. Aapko **Bot Token** milega (Example: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Bot Token Add Karna

`telegram-bot.js` file kholo aur line 4 pe apna token dalo:

```javascript
const token = 'YOUR_BOT_TOKEN';  // Yahan apna token paste karo
```

## Step 3: Bot Chalana

Terminal mein command run karo:

```bash
cd "/home/alok-mohan/WhatsApp Boat"
node telegram-bot.js
```

## Step 4: Bot Test Karna

1. Telegram app mein apne bot ko search karo (jo username diya tha)
2. **Start** button click karo ya `/start` type karo
3. **Clickable buttons** dikhenge! 🎉

## Features:

✅ **Real Clickable Buttons** - Koi typing nahi!
✅ **Hindi + English** - Dono languages
✅ **Navigation** - Aage peeche ja sakte ho
✅ **Clean UI** - Professional design
✅ **Fast** - Instant responses

## Commands:

- `/start` - Bot start karo

## Bot Structure:

```
/start
  → Language Selection (Hindi/English)
    → Main Menu
      → Admission (Class 9, 10, 11, 12)
      → Online Courses
      → Exams
      → Results
      → Nodal Center
      → Main Menu (Go Back)
```

## Troubleshooting:

**Error: "Polling error"**
- Token check karo ki sahi hai

**Bot respond nahi kar raha**
- Bot ko stop karke restart karo
- Internet connection check karo

**Buttons nahi dikh rahe**
- Bot restart karo
- Latest Telegram app version use karo

## Notes:

- Bot 24/7 chalega jab tak terminal open hai
- Production ke liye: VPS/Cloud server pe deploy karo
- Webhooks use kar sakte ho polling ki jagah
