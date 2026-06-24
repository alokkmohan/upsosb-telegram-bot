const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

function initFile(file, defaultData) {
  if (!fs.existsSync(path.join(DATA_DIR, file))) writeJSON(file, defaultData);
}

// Initialize data files with defaults
initFile('settings.json', {
  bot_name: 'UPSOSB Bot',
  welcome_message: '🙏 नमस्कार! UPSOSB बॉट में आपका स्वागत है।\n\nनीचे से अपना विकल्प चुनें:',
  logo_path: '',
  require_auth: false,
  admin_password: 'admin123'
});
initFile('menus.json', { items: [], nextId: 1 });
initFile('content.json', { items: [], nextId: 1 });

module.exports = {
  // ---- SETTINGS ----
  getSettings() { return readJSON('settings.json'); },

  setSetting(key, value) {
    const s = readJSON('settings.json');
    s[key] = value;
    writeJSON('settings.json', s);
  },

  // ---- MENUS ----
  getMenus() { return readJSON('menus.json').items; },

  getMenu(id) { return readJSON('menus.json').items.find(m => m.id === id) || null; },

  getMenusByParent(parentId) {
    return readJSON('menus.json').items
      .filter(m => m.parent_id === (parentId || null) && m.active !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  addMenu({ parent_id, title, title_en, emoji, description }) {
    const store = readJSON('menus.json');
    const menu = {
      id: store.nextId++,
      parent_id: parent_id || null,
      title,
      title_en: title_en || '',
      emoji: emoji || '',
      description: description || '',
      order: store.items.filter(m => m.parent_id === (parent_id || null)).length,
      active: true
    };
    store.items.push(menu);
    writeJSON('menus.json', store);
    return menu;
  },

  updateMenu(id, data) {
    const store = readJSON('menus.json');
    const idx = store.items.findIndex(m => m.id === id);
    if (idx === -1) return false;
    store.items[idx] = { ...store.items[idx], ...data };
    writeJSON('menus.json', store);
    return true;
  },

  deleteMenu(id) {
    const menuStore = readJSON('menus.json');
    const contentStore = readJSON('content.json');

    const toDelete = [id];
    const findChildren = (pid) => {
      menuStore.items.filter(m => m.parent_id === pid).forEach(m => {
        toDelete.push(m.id);
        findChildren(m.id);
      });
    };
    findChildren(id);

    menuStore.items = menuStore.items.filter(m => !toDelete.includes(m.id));
    contentStore.items = contentStore.items.filter(c => !toDelete.includes(c.menu_id));

    writeJSON('menus.json', menuStore);
    writeJSON('content.json', contentStore);
    return toDelete;
  },

  // ---- CONTENT ----
  getMenuContent(menuId) {
    return readJSON('content.json').items
      .filter(c => c.menu_id === menuId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  addContent({ menu_id, type, title, title_en, content, content_en, file_path }) {
    const store = readJSON('content.json');
    const item = {
      id: store.nextId++,
      menu_id,
      type,
      title: title || '',
      title_en: title_en || '',
      content: content || '',
      content_en: content_en || '',
      file_path: file_path || '',
      order: store.items.filter(c => c.menu_id === menu_id).length
    };
    store.items.push(item);
    writeJSON('content.json', store);
    return item;
  },

  deleteContent(id) {
    const store = readJSON('content.json');
    store.items = store.items.filter(c => c.id !== id);
    writeJSON('content.json', store);
  },

  getAllContentCount() { return readJSON('content.json').items.length; },
  getPdfCount() { return readJSON('content.json').items.filter(c => c.type === 'pdf').length; }
};
