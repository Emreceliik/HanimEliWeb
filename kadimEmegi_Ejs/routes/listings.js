const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const multer = require('multer');

// Multer ayarları (resim yükleme)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// İlan Ekleme Sayfası
router.get('/add', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('listings/add', { user: req.session.user });
});

// İlan Ekleme İşlemi
router.post('/add', upload.single('image'), (req, res) => {
  const { title, description, category, price } = req.body;
  const userId = req.session.user.id;
  const imagePath = req.file ? '/uploads/' + req.file.filename : null;

  db.query(
    'INSERT INTO listings (user_id, title, description, category, price, image_path) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, description, category, price, imagePath],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

module.exports = router;
