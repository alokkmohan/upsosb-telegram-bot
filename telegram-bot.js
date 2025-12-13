const TelegramBot = require('node-telegram-bot-api');

// Bot Token from @BotFather
const token = '8557217217:AAHwgY6QgFyuCF4Nz1ylIqz0-_JOUmxZmoU';

// Bot configuration with better timeout handling
const bot = new TelegramBot(token, { 
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    },
    request: {
        agentOptions: {
            keepAlive: true,
            family: 4
        },
        proxy: false
    }
});

// User state tracking
const userState = {};

console.log('Telegram Bot chal raha hai...');

// Welcome function
function sendWelcomeMessage(chatId, userName) {
    userState[chatId] = { screen: 'language' };
    
    const welcomeMsg = `╔═══════════════════════╗
║   🙏 WELCOME! 🙏        ║
║   आपका स्वागत है!       ║
╚═══════════════════════╝

Hello ${userName}! 👋

आगे जारी रखने के लिए भाषा चुनें
To continue, choose your language

💡 Share this bot:
t.me/upsosb_bot`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🇮🇳 हिंदी (Hindi)', callback_data: 'lang_hindi' }],
                [{ text: '🇬🇧 English', callback_data: 'lang_english' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, welcomeMsg, options);
}

// Start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'User';
    sendWelcomeMessage(chatId, userName);
});

// Handle text messages (hi, hello, namaste, etc.)
bot.on('message', (msg) => {
    // Skip if it's a command
    if (msg.text && msg.text.startsWith('/')) {
        return;
    }
    
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text.toLowerCase().trim() : '';
    const userName = msg.from.first_name || 'User';
    
    // Greetings that trigger welcome message
    const greetings = ['hi', 'hello', 'hey', 'start', 'namaste', 'namaskar', 'हाय', 'हेलो', 'नमस्ते', 'नमस्कार'];
    
    if (greetings.includes(text)) {
        sendWelcomeMessage(chatId, userName);
    }
});

// Info command - Bot details
bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;
    const botUsername = 'upsosb_bot';
    
    const infoMsg = `╔════════════════════════╗
║   ℹ️  BOT INFORMATION   ║
╚════════════════════════╝

🤖 Bot Username:
   @${botUsername}

🔗 Share Link:
   t.me/${botUsername}

📱 How to connect:
   1. Open Telegram
   2. Search: @${botUsername}
   3. Press Start
   4. Choose language

💬 Commands:
   /start - Start bot
   /info - Bot information
   /help - Get help

📞 24/7 Active Support!`;
    
    bot.sendMessage(chatId, infoMsg);
});

// Help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const helpMsg = `╔════════════════════════╗
║      🆘 HELP MENU       ║
╚════════════════════════╝

📝 Available Options:
   • Admission Info
   • Online Courses
   • Exam Details
   • Results
   • Nodal Centers

🔄 Navigation:
   • Click buttons to navigate
   • Use "Go Back" to return
   • Type /start to restart

💡 Tips:
   • No typing needed!
   • All options are clickable
   • Fast & Easy to use

Need more help?
Type /info for bot details`;
    
    bot.sendMessage(chatId, helpMsg);
});

// Handle callback queries (button clicks)
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;
    
    // Answer callback query to remove loading state
    bot.answerCallbackQuery(callbackQuery.id);
    
    // Language Selection
    if (data === 'lang_hindi') {
        userState[chatId] = { screen: 'main_menu', language: 'hindi' };
        showHindiMainMenu(chatId);
    }
    else if (data === 'lang_english') {
        userState[chatId] = { screen: 'main_menu', language: 'english' };
        showEnglishMainMenu(chatId);
    }
    
    // Hindi Main Menu Options
    else if (data === 'hindi_admission') {
        userState[chatId].screen = 'admission';
        showHindiAdmissionMenu(chatId);
    }
    else if (data === 'hindi_courses') {
        bot.sendMessage(chatId, '💻 Online पाठ्यक्रम जल्द आ रहे हैं...');
    }
    else if (data === 'hindi_exams') {
        bot.sendMessage(chatId, '📋 परीक्षा जानकारी जल्द आ रही है...');
    }
    else if (data === 'hindi_results') {
        bot.sendMessage(chatId, '🎯 परिणाम जल्द उपलब्ध होंगे...');
    }
    else if (data === 'hindi_nodal') {
        bot.sendMessage(chatId, '🏢 नोडल सेंटर जानकारी जल्द आ रही है...');
    }
    else if (data === 'hindi_main_menu') {
        userState[chatId] = { screen: 'language' };
        bot.sendMessage(chatId, 'भाषा चुनें / Choose Language:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇮🇳 हिंदी (Hindi)', callback_data: 'lang_hindi' }],
                    [{ text: '🇬🇧 English', callback_data: 'lang_english' }]
                ]
            }
        });
    }
    
    // English Main Menu Options
    else if (data === 'english_admission') {
        userState[chatId].screen = 'admission';
        showEnglishAdmissionMenu(chatId);
    }
    else if (data === 'english_courses') {
        bot.sendMessage(chatId, '💻 Online Courses coming soon...');
    }
    else if (data === 'english_exams') {
        bot.sendMessage(chatId, '📋 Exams information coming soon...');
    }
    else if (data === 'english_results') {
        bot.sendMessage(chatId, '🎯 Results will be available soon...');
    }
    else if (data === 'english_nodal') {
        bot.sendMessage(chatId, '🏢 Nodal Center information coming soon...');
    }
    else if (data === 'english_main_menu') {
        userState[chatId] = { screen: 'language' };
        bot.sendMessage(chatId, 'भाषा चुनें / Choose Language:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🇮🇳 हिंदी (Hindi)', callback_data: 'lang_hindi' }],
                    [{ text: '🇬🇧 English', callback_data: 'lang_english' }]
                ]
            }
        });
    }
    
    // Admission Menu Options
    else if (data === 'admission_back') {
        userState[chatId].screen = 'main_menu';
        if (userState[chatId].language === 'hindi') {
            showHindiMainMenu(chatId);
        } else {
            showEnglishMainMenu(chatId);
        }
    }
    else if (data.startsWith('class_')) {
        const className = data.replace('class_', '');
        const lang = userState[chatId].language;
        if (lang === 'hindi') {
            bot.sendMessage(chatId, `📘 कक्षा ${className} के लिए प्रवेश प्रक्रिया जल्द उपलब्ध होगी...`);
        } else {
            bot.sendMessage(chatId, `📘 Admission process for Class ${className} coming soon...`);
        }
    }
});

// Hindi Main Menu
function showHindiMainMenu(chatId) {
    const menuMsg = `╔═══════════════════════╗
║      📚 मुख्य मेन्यू       ║
╚═══════════════════════╝

कृपया एक विकल्प चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📝 प्रवेश', callback_data: 'hindi_admission' }],
                [{ text: '💻 Online पाठ्यक्रम', callback_data: 'hindi_courses' }],
                [{ text: '📋 परीक्षा', callback_data: 'hindi_exams' }],
                [{ text: '🎯 परिणाम', callback_data: 'hindi_results' }],
                [{ text: '🏢 नोडल सेंटर', callback_data: 'hindi_nodal' }],
                [{ text: '🏠 मुख्य मेन्यू', callback_data: 'hindi_main_menu' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, menuMsg, options);
}

// English Main Menu
function showEnglishMainMenu(chatId) {
    const menuMsg = `╔═══════════════════════╗
║      📚 MAIN MENU       ║
╚═══════════════════════╝

Please choose an option:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📝 Admission', callback_data: 'english_admission' }],
                [{ text: '💻 Online Courses', callback_data: 'english_courses' }],
                [{ text: '📋 Exams', callback_data: 'english_exams' }],
                [{ text: '🎯 Results', callback_data: 'english_results' }],
                [{ text: '🏢 Nodal Center', callback_data: 'english_nodal' }],
                [{ text: '🏠 Main Menu', callback_data: 'english_main_menu' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, menuMsg, options);
}

// Hindi Admission Menu
function showHindiAdmissionMenu(chatId) {
    const menuMsg = `╔═══════════════════════╗
║      📝 प्रवेश मेन्यू       ║
╚═══════════════════════╝

कक्षा चुनें:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📘 कक्षा 9वीं', callback_data: 'class_9' }],
                [{ text: '📗 कक्षा 10वीं', callback_data: 'class_10' }],
                [{ text: '📙 कक्षा 11वीं', callback_data: 'class_11' }],
                [{ text: '📕 कक्षा 12वीं', callback_data: 'class_12' }],
                [{ text: '⬅️ वापस जाएं', callback_data: 'admission_back' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, menuMsg, options);
}

// English Admission Menu
function showEnglishAdmissionMenu(chatId) {
    const menuMsg = `╔═══════════════════════╗
║   📝 ADMISSION MENU     ║
╚═══════════════════════╝

Choose Class:`;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📘 Class 9th', callback_data: 'class_9' }],
                [{ text: '📗 Class 10th', callback_data: 'class_10' }],
                [{ text: '📙 Class 11th', callback_data: 'class_11' }],
                [{ text: '📕 Class 12th', callback_data: 'class_12' }],
                [{ text: '⬅️ Go Back', callback_data: 'admission_back' }]
            ]
        }
    };
    
    bot.sendMessage(chatId, menuMsg, options);
}

// Error handling with better logging
bot.on('polling_error', (error) => {
    if (error.code === 'EFATAL' || error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
        console.log('Network issue - bot will retry automatically...');
    } else {
        console.log('Polling error:', error.code || error.message);
    }
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    if (reason.code === 'ETIMEDOUT' || reason.code === 'ECONNRESET') {
        console.log('Network timeout - bot continuing...');
    } else {
        console.log('Unhandled rejection:', reason);
    }
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nBot band ho raha hai...');
    bot.stopPolling();
    process.exit(0);
});
