const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

// User state tracking
const userState = {};

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR Code scan karo apne phone se!');
});

client.on('ready', () => {
    console.log('Bot ready hai!');
});

client.on('message', async (msg) => {
    const message = msg.body.toLowerCase().trim();
    const userId = msg.from;
    
    // Welcome Message - Reset state
    if (message === 'hello' || message === 'hi' || message === 'start') {
        userState[userId] = { screen: 'language' };
        const welcomeMsg = `╔═══════════════════════╗
║   🙏 WELCOME! 🙏        ║
║   आपका स्वागत है!       ║
╚═══════════════════════╝

आगे जारी रखने के लिए भाषा चुनें
To continue, choose your language

┌─────────────────────┐
│  👉 1️⃣  हिंदी (Hindi)   │
│  👉 2️⃣  English         │
└─────────────────────┘

कृपया 1 या 2 टाइप करें
Please type 1 or 2`;
        msg.reply(welcomeMsg);
    }
    
    // Language Selection
    else if (userState[userId]?.screen === 'language') {
        if (message === '1') {
            userState[userId] = { screen: 'main_menu', language: 'hindi' };
            const hindiMenu = `╔═══════════════════════╗
║      📚 मुख्य मेन्यू       ║
╚═══════════════════════╝

कृपया एक विकल्प चुनें:

┌─────────────────────────┐
│  1️⃣  📝 प्रवेश              │
│  2️⃣  💻 Online पाठ्यक्रम    │
│  3️⃣  📋 परीक्षा             │
│  4️⃣  🎯 परिणाम             │
│  5️⃣  🏢 नोडल सेंटर          │
│  6️⃣  🏠 मुख्य मेन्यू        │
└─────────────────────────┘

कृपया संख्या टाइप करें (1-6)`;
            msg.reply(hindiMenu);
        }
        else if (message === '2') {
            userState[userId] = { screen: 'main_menu', language: 'english' };
            const englishMenu = `╔═══════════════════════╗
║      📚 MAIN MENU       ║
╚═══════════════════════╝

Please choose an option:

┌─────────────────────────┐
│  1️⃣  📝 Admission          │
│  2️⃣  💻 Online Courses     │
│  3️⃣  📋 Exams              │
│  4️⃣  🎯 Results            │
│  5️⃣  🏢 Nodal Center       │
│  6️⃣  🏠 Main Menu          │
└─────────────────────────┘

Please type a number (1-6)`;
            msg.reply(englishMenu);
        }
    }
    
    // Main Menu Options
    else if (userState[userId]?.screen === 'main_menu') {
        if (message === '1') {
            userState[userId].screen = 'admission';
            if (userState[userId].language === 'hindi') {
                const admissionHindi = `╔═══════════════════════╗
║      📝 प्रवेश मेन्यू       ║
╚═══════════════════════╝

कक्षा चुनें:

┌─────────────────────────┐
│  1️⃣  📘 कक्षा 9वीं          │
│  2️⃣  📗 कक्षा 10वीं         │
│  3️⃣  📙 कक्षा 11वीं         │
│  4️⃣  📕 कक्षा 12वीं         │
│  0️⃣  ⬅️  वापस जाएं         │
└─────────────────────────┘

कृपया संख्या टाइप करें`;
                msg.reply(admissionHindi);
            } else {
                const admissionEnglish = `╔═══════════════════════╗
║   📝 ADMISSION MENU     ║
╚═══════════════════════╝

Choose Class:

┌─────────────────────────┐
│  1️⃣  📘 Class 9th          │
│  2️⃣  📗 Class 10th         │
│  3️⃣  📙 Class 11th         │
│  4️⃣  📕 Class 12th         │
│  0️⃣  ⬅️  Go Back           │
└─────────────────────────┘

Please type a number`;
                msg.reply(admissionEnglish);
            }
        }
        else if (message === '6') {
            // Go back to language selection
            userState[userId] = { screen: 'language' };
            const welcomeMsg = `╔═══════════════════════╗
║   🙏 WELCOME! 🙏        ║
║   आपका स्वागत है!       ║
╚═══════════════════════╝

आगे जारी रखने के लिए भाषा चुनें
To continue, choose your language

┌─────────────────────┐
│  👉 1️⃣  हिंदी (Hindi)   │
│  👉 2️⃣  English         │
└─────────────────────┘

कृपया 1 या 2 टाइप करें
Please type 1 or 2`;
            msg.reply(welcomeMsg);
        }
    }
    
    // Admission Submenu Options
    else if (userState[userId]?.screen === 'admission') {
        if (message === '0') {
            // Go back to main menu
            userState[userId].screen = 'main_menu';
            if (userState[userId].language === 'hindi') {
                const hindiMenu = `╔═══════════════════════╗
║      📚 मुख्य मेन्यू       ║
╚═══════════════════════╝

कृपया एक विकल्प चुनें:

┌─────────────────────────┐
│  1️⃣  📝 प्रवेश              │
│  2️⃣  💻 Online पाठ्यक्रम    │
│  3️⃣  📋 परीक्षा             │
│  4️⃣  🎯 परिणाम             │
│  5️⃣  🏢 नोडल सेंटर          │
│  6️⃣  🏠 मुख्य मेन्यू        │
└─────────────────────────┘

कृपया संख्या टाइप करें (1-6)`;
                msg.reply(hindiMenu);
            } else {
                const englishMenu = `╔═══════════════════════╗
║      📚 MAIN MENU       ║
╚═══════════════════════╝

Please choose an option:

┌─────────────────────────┐
│  1️⃣  📝 Admission          │
│  2️⃣  💻 Online Courses     │
│  3️⃣  📋 Exams              │
│  4️⃣  🎯 Results            │
│  5️⃣  🏢 Nodal Center       │
│  6️⃣  🏠 Main Menu          │
└─────────────────────────┘

Please type a number (1-6)`;
                msg.reply(englishMenu);
            }
        }
    }
});

client.initialize();