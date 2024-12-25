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
  res.render('listings/add', { title: 'İlan Ekle', user: req.session.user });
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

// İlan Düzenleme Sayfası (GET)
router.get('/:id/edit', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const listingId = req.params.id;

  db.query(
    'SELECT * FROM listings WHERE id = ? AND user_id = ?',
    [listingId, req.session.user.id],
    (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.redirect('/user/dashboard');
      }

      const listing = results[0];
      res.render('listings/edit', { title: 'İlan Düzenle', listing, user: req.session.user });
    }
  );
});

// İlan Düzenleme İşlemi (POST)
router.post('/:id/edit', upload.single('image'), (req, res) => {
  const { title, description, category, price } = req.body;
  const listingId = req.params.id;
  const imagePath = req.file ? '/uploads/' + req.file.filename : null;

  // Güncellenen resim yolu varsa, mevcut resmi güncelle
  const updateQuery = `
    UPDATE listings
    SET title = ?, description = ?, category = ?, price = ?, image_path = ?
    WHERE id = ? AND user_id = ?
  `;
  const updateValues = [
    title,
    description,
    category,
    price,
    imagePath || null, // Eğer resim yüklenmemişse null bırak
    listingId,
    req.session.user.id,
  ];

  db.query(updateQuery, updateValues, (err) => {
    if (err) throw err;
    res.redirect('/user/dashboard');
  });
});

// İlan Silme İşlemi (GET)
router.get('/:id/delete', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const listingId = req.params.id;

  // İlanı veritabanından sil
  db.query(
    'DELETE FROM listings WHERE id = ? AND user_id = ?',
    [listingId, req.session.user.id],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

module.exports = router;
