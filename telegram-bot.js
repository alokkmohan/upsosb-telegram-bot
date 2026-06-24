const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const savedToken = (() => { try { return require('./db').getSettings().bot_token; } catch(e) { return ''; } })();
const token = process.env.BOT_TOKEN || savedToken || '8557217217:AAHwgY6QgFyuCF4Nz1ylIqz0-_JOUmxZmoU';

const bot = new TelegramBot(token, {
  polling: { interval: 300, autoStart: true, params: { timeout: 10 } },
  request: { agentOptions: { keepAlive: true, family: 4 } }
});

// ============================================================
// USER STATE & LANGUAGE
// ============================================================
const userState = {};
const userLang = {}; // chatId -> 'hi' | 'en'

function getLang(chatId) {
  return userLang[chatId] || 'hi';
}

// ============================================================
// TRANSLATIONS
// ============================================================
const T = {
  hi: {
    welcome_default: '🙏 नमस्कार! UPSOSB बॉट में आपका स्वागत है।\n\nनीचे से अपना विकल्प चुनें:',
    home_btn: '🏠 मुख्य मेनू',
    back_btn: '⬅️ वापस',
    lang_btn: '🌐 English',
    lang_changed: '✅ भाषा हिंदी में बदल गई!',
    no_content: '_(इस मेनू में अभी कोई सामग्री नहीं है)_',
    no_menus: '_(व्यवस्थापक ने अभी कोई मेनू नहीं बनाया है)_',
    file_missing: '_(फ़ाइल सर्वर पर उपलब्ध नहीं है)_',
    ask_reg: '🔐 अपना *पंजीकरण संख्या* दर्ज करें:',
    wrong_reg: '❌ पंजीकरण संख्या गलत है।\n\nकृपया सही संख्या दर्ज करें:',
    ask_dob: '📅 आपका पंजीकरण नंबर मिल गया!\n\nअब *जन्म तिथि* दर्ज करें (DD/MM/YYYY):',
    wrong_dob: '❌ जन्म तिथि गलत है।\n\nप्रारूप: DD/MM/YYYY\nदोबारा प्रयास करें:',
    login_ok: '✅ लॉगिन सफल!\n\n*नमस्कार {name}!*\nकक्षा: {class} | जिला: {district}',
  },
  en: {
    welcome_default: '🙏 Welcome to UPSOSB Bot!\n\nPlease select an option below:',
    home_btn: '🏠 Main Menu',
    back_btn: '⬅️ Back',
    lang_btn: '🌐 हिंदी',
    lang_changed: '✅ Language set to English!',
    no_content: '_(No content available in this menu yet)_',
    no_menus: '_(No menus created yet by admin)_',
    file_missing: '_(File not available on server)_',
    ask_reg: '🔐 Please enter your *Registration Number*:',
    wrong_reg: '❌ Registration number is incorrect.\n\nPlease enter the correct number:',
    ask_dob: '📅 Registration number found!\n\nNow enter your *Date of Birth* (DD/MM/YYYY):',
    wrong_dob: '❌ Date of Birth is incorrect.\n\nFormat: DD/MM/YYYY\nPlease try again:',
    login_ok: '✅ Login successful!\n\n*Hello {name}!*\nClass: {class} | District: {district}',
  }
};

function t(chatId, key, vars = {}) {
  const lang = getLang(chatId);
  let str = T[lang][key] || T['hi'][key] || key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  return str;
}

// Get menu title in user's language
function menuTitle(menu, chatId) {
  const lang = getLang(chatId);
  const title = (lang === 'en' && menu.title_en) ? menu.title_en : menu.title;
  return (menu.emoji ? menu.emoji + ' ' : '') + title;
}

// ============================================================
// STUDENT DATABASE
// ============================================================
const studentDatabase = {
  "12345": { name: "Rahul Kumar",   class: 10, dob: "01/01/2000", district: "Agra" },
  "10001": { name: "Priya Singh",   class: 10, dob: "15/08/2008", district: "Prayagraj" },
  "10002": { name: "Amit Sharma",   class: 10, dob: "20/06/2009", district: "Lucknow" },
  "11001": { name: "Anjali Mishra", class: 11, dob: "05/01/2008", district: "Mathura" },
  "12001": { name: "Divya Pandey",  class: 12, dob: "08/02/2006", district: "Prayagraj" },
  "12002": { name: "Sanjay Kumar",  class: 12, dob: "30/10/2006", district: "Ghaziabad" },
};

// ============================================================
// KEYBOARD BUILDER
// ============================================================
function buildKeyboard(menus, backData, chatId) {
  const rows = [];
  for (let i = 0; i < menus.length; i += 2) {
    const row = [{ text: menuTitle(menus[i], chatId), callback_data: 'm:' + menus[i].id }];
    if (menus[i + 1]) row.push({ text: menuTitle(menus[i + 1], chatId), callback_data: 'm:' + menus[i + 1].id });
    rows.push(row);
  }
  if (backData) {
    rows.push([{ text: backData === 'home' ? t(chatId, 'home_btn') : t(chatId, 'back_btn'), callback_data: backData }]);
  }
  return { inline_keyboard: rows };
}

function buildMainKeyboard(menus, chatId) {
  const rows = [];
  for (let i = 0; i < menus.length; i += 2) {
    const row = [{ text: menuTitle(menus[i], chatId), callback_data: 'm:' + menus[i].id }];
    if (menus[i + 1]) row.push({ text: menuTitle(menus[i + 1], chatId), callback_data: 'm:' + menus[i + 1].id });
    rows.push(row);
  }
  // Language toggle button at bottom
  rows.push([{ text: t(chatId, 'lang_btn'), callback_data: 'lang' }]);
  return { inline_keyboard: rows };
}

// ============================================================
// SHOW MAIN MENU
// ============================================================
async function showMainMenu(chatId, msgId) {
  const settings = db.getSettings();
  const menus = db.getMenusByParent(null);
  const lang = getLang(chatId);

  // Welcome message — use language-specific if set
  const welcomeText = (lang === 'en' && settings.welcome_message_en)
    ? settings.welcome_message_en
    : (settings.welcome_message || t(chatId, 'welcome_default'));

  if (!menus.length) {
    return bot.sendMessage(chatId, welcomeText + '\n\n' + t(chatId, 'no_menus'), { parse_mode: 'Markdown' });
  }

  const keyboard = buildMainKeyboard(menus, chatId);

  if (msgId) {
    try {
      await bot.editMessageText(welcomeText, { chat_id: chatId, message_id: msgId, reply_markup: keyboard, parse_mode: 'Markdown' });
    } catch (e) {
      await bot.sendMessage(chatId, welcomeText, { reply_markup: keyboard, parse_mode: 'Markdown' });
    }
  } else {
    // Send logo if set
    const logoPath = settings.logo_path ? path.join(__dirname, settings.logo_path) : null;
    if (logoPath && fs.existsSync(logoPath)) {
      try { await bot.sendPhoto(chatId, logoPath); } catch (e) {}
    }
    await bot.sendMessage(chatId, welcomeText, { reply_markup: keyboard, parse_mode: 'Markdown' });
  }
}

// ============================================================
// SHOW MENU
// ============================================================
async function showMenu(chatId, msgId, menuId) {
  const menu = db.getMenu(menuId);
  if (!menu) return bot.sendMessage(chatId, '❌ Menu nahi mila.');

  const subMenus = db.getMenusByParent(menuId);
  const content = db.getMenuContent(menuId);
  const backData = menu.parent_id ? 'm:' + menu.parent_id : 'home';
  const lang = getLang(chatId);

  // Send content items
  for (const c of content) {
    // Pick language-specific content
    const text = (lang === 'en' && c.content_en) ? c.content_en : c.content;
    const title = (lang === 'en' && c.title_en) ? c.title_en : c.title;

    if (c.type === 'text') {
      if (text) await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } else if (c.type === 'pdf') {
      const filePath = path.join(__dirname, c.file_path);
      if (fs.existsSync(filePath)) {
        await bot.sendDocument(chatId, filePath, { caption: title || '' });
      } else {
        await bot.sendMessage(chatId, `📄 *${title}*\n${t(chatId, 'file_missing')}`, { parse_mode: 'Markdown' });
      }
    } else if (c.type === 'link') {
      const linkTitle = title || text;
      await bot.sendMessage(chatId, `🔗 *${linkTitle}*`, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔗 ' + linkTitle, url: text }]] }
      });
    }
  }

  // Show sub-menu navigation
  if (subMenus.length > 0) {
    const keyboard = buildKeyboard(subMenus, backData, chatId);
    const label = menuTitle(menu, chatId);
    if (msgId) {
      try {
        await bot.editMessageText(label, { chat_id: chatId, message_id: msgId, reply_markup: keyboard });
      } catch (e) {
        await bot.sendMessage(chatId, label, { reply_markup: keyboard });
      }
    } else {
      await bot.sendMessage(chatId, label, { reply_markup: keyboard });
    }
  } else {
    const backKeyboard = { inline_keyboard: [[{ text: backData === 'home' ? t(chatId, 'home_btn') : t(chatId, 'back_btn'), callback_data: backData }]] };
    if (!content.length) {
      await bot.sendMessage(chatId, menuTitle(menu, chatId) + '\n\n' + t(chatId, 'no_content'), {
        parse_mode: 'Markdown', reply_markup: backKeyboard
      });
    } else {
      await bot.sendMessage(chatId, menuTitle(menu, chatId), { reply_markup: backKeyboard });
    }
  }
}

// ============================================================
// /start COMMAND
// ============================================================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const settings = db.getSettings();
  const requireAuth = settings.require_auth === true || settings.require_auth === 'true';

  if (requireAuth) {
    userState[chatId] = { step: 'ask_reg' };
    await bot.sendMessage(chatId, t(chatId, 'ask_reg'), { parse_mode: 'Markdown' });
  } else {
    userState[chatId] = { step: 'done' };
    await showMainMenu(chatId, null);
  }
});

// ============================================================
// MESSAGE HANDLER
// ============================================================
bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  const state = userState[chatId] || {};

  if (state.step === 'ask_reg') {
    const student = studentDatabase[text];
    if (!student) return bot.sendMessage(chatId, t(chatId, 'wrong_reg'));
    userState[chatId] = { step: 'ask_dob', student };
    return bot.sendMessage(chatId, t(chatId, 'ask_dob'), { parse_mode: 'Markdown' });
  }

  if (state.step === 'ask_dob') {
    const student = state.student;
    if (text !== student.dob) return bot.sendMessage(chatId, t(chatId, 'wrong_dob'));
    userState[chatId] = { step: 'done', student };
    await bot.sendMessage(chatId, t(chatId, 'login_ok', { name: student.name, class: student.class, district: student.district }), { parse_mode: 'Markdown' });
    await showMainMenu(chatId, null);
    return;
  }

  if (state.step === 'done') {
    await showMainMenu(chatId, null);
  }
});

// ============================================================
// CALLBACK QUERY (menu navigation + language toggle)
// ============================================================
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  try {
    if (data === 'lang') {
      // Toggle language
      const current = getLang(chatId);
      userLang[chatId] = current === 'hi' ? 'en' : 'hi';
      await bot.answerCallbackQuery(query.id, { text: t(chatId, 'lang_changed') });
      await showMainMenu(chatId, msgId);
      return;
    }

    if (data === 'home') {
      try { await bot.deleteMessage(chatId, msgId); } catch (e) {}
      await showMainMenu(chatId, null);
    } else if (data.startsWith('m:')) {
      const menuId = parseInt(data.split(':')[1]);
      await showMenu(chatId, msgId, menuId);
    }
  } catch (e) {
    console.error('Callback error:', e.message);
  }

  try { await bot.answerCallbackQuery(query.id); } catch (e) {}
});

// ============================================================
// ERROR HANDLING
// ============================================================
bot.on('polling_error', (err) => console.error('Polling error:', err.message));

console.log('🤖 UPSOSB Bot chal raha hai...');
console.log('📋 Menus database se live load honge');
console.log('🌐 Hindi/English language toggle active hai');
