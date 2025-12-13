# 🎓 UPSOSB Telegram Bot

A comprehensive Telegram bot for **UP State Open School Board (UPSOSB)** students to access study materials, admission information, exam details, and more.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![Language](https://img.shields.io/badge/Language-Hindi%20%7C%20English-blue)]()
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)]()

## 🌟 Features

### ✅ Implemented
- **Bilingual Support** - Complete Hindi & English interface
- **Authentication System** - Registration number + DOB verification
- **Study Materials** - Mathematics (15 chapters) with PDF downloads
- **Admission Information** - Classes 9-12 with detailed eligibility
- **Nodal Centers** - All 75 UP districts coverage
- **FAQ System** - 45+ questions across 7 categories
- **About Us** - Vision, Mission, Ordinance with PDF downloads
- **Important Dates** - Admission, Exam, Result schedules
- **Contact Information** - With Google Maps integration

### 🔄 Coming Soon
- Science study materials
- Social Science materials
- English materials
- Hindi materials
- Exam results system
- Online fee payment

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Telegram Bot Token ([Get from BotFather](https://t.me/botfather))

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/upsosb-telegram-bot.git
cd upsosb-telegram-bot
```

### 2. Install Dependencies
```bash
npm install node-telegram-bot-api
```

### 3. Configure Bot Token
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your bot token
nano .env
```

Add your token:
```
BOT_TOKEN=your_telegram_bot_token_here
```

### 4. Update Code to Use Environment Variable

In `telegram-bot-complete.js`, replace:
```javascript
const token = '8557217217:AAHwgY6QgFyuCF4Nz1ylIqz0-_JOUmxZmoU';
```

With:
```javascript
require('dotenv').config();
const token = process.env.BOT_TOKEN;
```

Install dotenv:
```bash
npm install dotenv
```

### 5. Run Bot
```bash
# Development mode
node telegram-bot-complete.js

# Production mode (background)
nohup node telegram-bot-complete.js > bot.log 2>&1 &
```

## 📁 Project Structure

```
upsosb-telegram-bot/
├── telegram-bot-complete.js    # Main bot file (3425+ lines)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # npm dependencies
├── README.md                    # This file
│
├── Documentation/
│   ├── PROJECT_STATUS.md       # Complete feature status
│   ├── DATABASE_INTEGRATION_GUIDE.md
│   ├── TESTING_GUIDE.md
│   └── FINAL_SUMMARY.md
│
├── Subject/
│   ├── Math/                   # Mathematics PDFs
│   ├── Science/                # Science PDFs (coming soon)
│   ├── Social/                 # Social Science PDFs (coming soon)
│   ├── English/                # English PDFs (coming soon)
│   └── Hindi/                  # Hindi PDFs (coming soon)
│
├── PDF English/                # About Us documents (English)
└── PDF Hindi/                  # About Us documents (Hindi)
```

## 🎯 Demo Credentials

**Test Account:**
- Registration Number: `12345`
- Date of Birth: `01/01/2000`
- Access: All subjects

See `TESTING_GUIDE.md` for more test accounts.

## 🔧 Configuration

### Student Database
Currently uses mock database in code. For production:
- See `DATABASE_INTEGRATION_GUIDE.md` for SQL/MongoDB setup
- Update `studentDatabase` object with real data
- Or connect to external database

### Study Material PDFs
Place PDFs in respective folders:
- `Subject/Math/chapter1.pdf` to `chapter15.pdf`
- See `Subject/README.md` for naming conventions

## 📚 Documentation

- **[Project Status](PROJECT_STATUS.md)** - Complete feature list
- **[Testing Guide](TESTING_GUIDE.md)** - How to test the bot
- **[Database Guide](DATABASE_INTEGRATION_GUIDE.md)** - SQL/MongoDB integration
- **[Final Summary](FINAL_SUMMARY.md)** - Project overview

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Contact

**Organization:** Patrachar Shiksha Sansthan  
**Email:** patracharshikshasansthan@gmail.com  
**Toll Free:** 1800 00 000  
**Location:** Prayagraj, Uttar Pradesh 211001  

**Bot:** [@upsosb_bot](https://t.me/upsosb_bot)

## 🙏 Acknowledgments

- UP State Open School Board
- Educate Girl NGO
- Telegram Bot API
- Node.js Community

## ⚠️ Security Note

**IMPORTANT:** Never commit your `.env` file or bot token to GitHub!
- Token is in `.gitignore`
- Use `.env.example` as template
- Keep your bot token private

---

**Made with ❤️ for UP State Open School Board Students**

**Version:** 2.0  
**Status:** Production Ready (95%)  
**Last Updated:** December 13, 2025
