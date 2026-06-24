const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const token = process.env.BOT_TOKEN || '8557217217:AAHwgY6QgFyuCF4Nz1ylIqz0-_JOUmxZmoU';

const bot = new TelegramBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: { timeout: 10 }
  },
  request: {
    agentOptions: { keepAlive: true, family: 4 }
  }
});

// ============================================================
// STUDENT DATABASE (authentication ke liye, agar require_auth=true)
// ============================================================
const studentDatabase = {
  "12345": { name: "Rahul Kumar", class: 10, dob: "01/01/2000", district: "Agra" },
  "10001": { name: "Priya Singh", class: 10, dob: "15/08/2008", district: "Prayagraj" },
  "10002": { name: "Amit Sharma", class: 10, dob: "20/06/2009", district: "Lucknow" },
  "11001": { name: "Anjali Mishra", class: 11, dob: "05/01/2008", district: "Mathura" },
  "12001": { name: "Divya Pandey", class: 12, dob: "08/02/2006", district: "Prayagraj" },
  "12002": { name: "Sanjay Kumar", class: 12, dob: "30/10/2006", district: "Ghaziabad" },
};

// User state (auth flow ke liye)
const userState = {};

// ============================================================
// HELPERS
// ============================================================

function buildKeyboard(menus, backData) {
  const rows = [];
  for (let i = 0; i < menus.length; i += 2) {
    const row = [{ text: (menus[i].emoji ? menus[i].emoji + ' ' : '') + menus[i].title, callback_data: 'm:' + menus[i].id }];
    if (menus[i + 1]) row.push({ text: (menus[i + 1].emoji ? menus[i + 1].emoji + ' ' : '') + menus[i + 1].title, callback_data: 'm:' + menus[i + 1].id });
    rows.push(row);
  }
  if (backData) rows.push([{ text: backData === 'home' ? '🏠 Main Menu' : '⬅️ Wapas', callback_data: backData }]);
  return { inline_keyboard: rows };
}

async function showMainMenu(chatId, msgId) {
  const settings = db.getSettings();
  const menus = db.getMenusByParent(null);
  const welcomeText = settings.welcome_message || '🙏 UPSOSB Bot mein aapka swagat hai!\n\nNiche se option chunein:';

  if (!menus.length) {
    return bot.sendMessage(chatId, welcomeText + '\n\n_(Admin ne abhi koi menu nahi banaya hai)_', { parse_mode: 'Markdown' });
  }

  const keyboard = buildKeyboard(menus, null);

  if (msgId) {
    try {
      await bot.editMessageText(welcomeText, { chat_id: chatId, message_id: msgId, reply_markup: keyboard });
    } catch (e) {
      await bot.sendMessage(chatId, welcomeText, { reply_markup: keyboard });
    }
  } else {
    // Logo bhejna agar set ho
    const logoPath = settings.logo_path ? path.join(__dirname, settings.logo_path) : null;
    if (logoPath && fs.existsSync(logoPath)) {
      try { await bot.sendPhoto(chatId, logoPath); } catch (e) {}
    }
    await bot.sendMessage(chatId, welcomeText, { reply_markup: keyboard });
  }
}

async function showMenu(chatId, msgId, menuId) {
  const menu = db.getMenu(menuId);
  if (!menu) return bot.sendMessage(chatId, '❌ Menu nahi mila.');

  const subMenus = db.getMenusByParent(menuId);
  const content = db.getMenuContent(menuId);
  const backData = menu.parent_id ? 'm:' + menu.parent_id : 'home';
  const menuLabel = (menu.emoji ? menu.emoji + ' ' : '') + menu.title;

  // Pehle saari content bhejo
  for (const c of content) {
    if (c.type === 'text') {
      await bot.sendMessage(chatId, c.content, { parse_mode: 'Markdown' });
    } else if (c.type === 'pdf') {
      const filePath = path.join(__dirname, c.file_path);
      if (fs.existsSync(filePath)) {
        await bot.sendDocument(chatId, filePath, { caption: c.title || '' });
      } else {
        await bot.sendMessage(chatId, `📄 *${c.title}*\n_(File upalabdh nahi hai)_`, { parse_mode: 'Markdown' });
      }
    } else if (c.type === 'link') {
      await bot.sendMessage(chatId, `🔗 *${c.title}*`, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔗 ' + c.title, url: c.content }]] }
      });
    }
  }

  // Agar sub-menus hain to navigation dikhao
  if (subMenus.length > 0) {
    const keyboard = buildKeyboard(subMenus, backData);
    if (msgId) {
      try {
        await bot.editMessageText(menuLabel, { chat_id: chatId, message_id: msgId, reply_markup: keyboard });
      } catch (e) {
        await bot.sendMessage(chatId, menuLabel, { reply_markup: keyboard });
      }
    } else {
      await bot.sendMessage(chatId, menuLabel, { reply_markup: keyboard });
    }
  } else if (!content.length) {
    // Na content na sub-menu
    const keyboard = { inline_keyboard: [[{ text: backData === 'home' ? '🏠 Main Menu' : '⬅️ Wapas', callback_data: backData }]] };
    await bot.sendMessage(chatId, menuLabel + '\n\n_(Abhi koi content nahi hai)_', { parse_mode: 'Markdown', reply_markup: keyboard });
  } else {
    // Content tha lekin sub-menus nahi — sirf back button
    const keyboard = { inline_keyboard: [[{ text: backData === 'home' ? '🏠 Main Menu' : '⬅️ Wapas', callback_data: backData }]] };
    await bot.sendMessage(chatId, menuLabel, { reply_markup: keyboard });
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
    await bot.sendMessage(chatId, '🔐 Apna *Registration Number* darj karein:', { parse_mode: 'Markdown' });
  } else {
    userState[chatId] = { step: 'done' };
    await showMainMenu(chatId, null);
  }
});

// ============================================================
// MESSAGE HANDLER (auth flow)
// ============================================================
bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  const state = userState[chatId] || {};

  if (state.step === 'ask_reg') {
    const student = studentDatabase[text];
    if (!student) {
      return bot.sendMessage(chatId, '❌ Registration number galat hai.\n\nKripya sahi number darj karein:');
    }
    userState[chatId] = { step: 'ask_dob', reg: text, student };
    return bot.sendMessage(chatId, `👤 *${student.name}* — Class ${student.class}\n\nAb apni *Date of Birth* darj karein (DD/MM/YYYY):`, { parse_mode: 'Markdown' });
  }

  if (state.step === 'ask_dob') {
    const student = state.student;
    if (text !== student.dob) {
      return bot.sendMessage(chatId, '❌ Date of Birth galat hai.\n\nFormat: DD/MM/YYYY\nDobara try karein:');
    }
    userState[chatId] = { step: 'done', student };
    await bot.sendMessage(chatId, `✅ Login safal!\n\n*Namaskar ${student.name}!*\nClass: ${student.class} | District: ${student.district}`, { parse_mode: 'Markdown' });
    await showMainMenu(chatId, null);
    return;
  }

  if (state.step === 'done') {
    await showMainMenu(chatId, null);
  }
});

// ============================================================
// CALLBACK QUERY (menu navigation)
// ============================================================
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const data = query.data;

  try {
    if (data === 'home') {
      await showMainMenu(chatId, msgId);
    } else if (data.startsWith('m:')) {
      const menuId = parseInt(data.split(':')[1]);
      await showMenu(chatId, msgId, menuId);
    }
  } catch (e) {
    console.error('Callback error:', e.message);
  }

  await bot.answerCallbackQuery(query.id);
});

// ============================================================
// ERROR HANDLING
// ============================================================
bot.on('polling_error', (err) => console.error('Polling error:', err.message));

console.log('🤖 UPSOSB Bot chal raha hai...');
console.log('📋 Menus database se live load honge');
