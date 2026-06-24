const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.ADMIN_PORT || 3000;

// Create upload directories
['uploads/logos', 'uploads/pdfs'].forEach(d =>
  fs.mkdirSync(path.join(__dirname, d), { recursive: true })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'logo' ? 'uploads/logos' : 'uploads/pdfs';
    cb(null, path.join(__dirname, dest));
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ======== SETTINGS ========

app.get('/api/settings', (req, res) => res.json(db.getSettings()));

app.post('/api/settings', (req, res) => {
  const { key, value } = req.body;
  db.setSetting(key, value);
  res.json({ ok: true });
});

app.post('/api/settings/logo', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const logoPath = 'uploads/logos/' + req.file.filename;
  db.setSetting('logo_path', logoPath);
  res.json({ ok: true, url: '/' + logoPath });
});

// ======== MENUS ========

app.get('/api/menus', (req, res) => res.json(db.getMenus()));

app.post('/api/menus', (req, res) => {
  const menu = db.addMenu(req.body);
  res.json({ ok: true, menu });
});

app.put('/api/menus/:id', (req, res) => {
  db.updateMenu(parseInt(req.params.id), req.body);
  res.json({ ok: true });
});

app.delete('/api/menus/:id', (req, res) => {
  db.deleteMenu(parseInt(req.params.id));
  res.json({ ok: true });
});

// ======== CONTENT ========

app.get('/api/menus/:id/content', (req, res) => {
  res.json(db.getMenuContent(parseInt(req.params.id)));
});

app.post('/api/menus/:id/content', upload.single('pdf'), (req, res) => {
  const menuId = parseInt(req.params.id);
  const { type, title, title_en, content, content_en } = req.body;
  let file_path = '';
  if (req.file) file_path = 'uploads/pdfs/' + req.file.filename;
  const item = db.addContent({ menu_id: menuId, type, title, title_en: title_en || '', content: content || '', content_en: content_en || '', file_path });
  res.json({ ok: true, item });
});

app.delete('/api/content/:id', (req, res) => {
  db.deleteContent(parseInt(req.params.id));
  res.json({ ok: true });
});

// ======== STATS ========

app.get('/api/stats', (req, res) => {
  const menus = db.getMenus();
  res.json({
    total_menus: menus.filter(m => !m.parent_id).length,
    sub_menus: menus.filter(m => m.parent_id).length,
    total_content: db.getAllContentCount(),
    pdf_count: db.getPdfCount()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Admin Portal chal raha hai: http://localhost:${PORT}`);
});
