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
  const userId = req.session.user.id;

  // Mevcut ilanı veritabanından sorgulayıp, eski resim yolunu alalım
  const getCurrentImageQuery = 'SELECT image_path FROM listings WHERE id = ? AND user_id = ?';
  db.query(getCurrentImageQuery, [listingId, userId], (err, result) => {
    if (err) throw err;
    
    // Mevcut resim varsa, eski resim yolunu kullan
    const currentImagePath = result.length > 0 ? result[0].image_path : null;
    
    // Yeni resim yolu, eğer varsa, mevcut resim yoluyla değiştirilir
    const imagePath = req.file ? '/uploads/' + req.file.filename : currentImagePath;

    // İlanı güncelle
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
      imagePath,
      listingId,
      userId
    ];

    db.query(updateQuery, updateValues, (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    });
  });
});

router.get('/:id/delete', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const listingId = req.params.id;

  // İlk olarak, bu ilana ait cart ve orders verilerini silmek için:
  const deleteOrdersQuery = 'DELETE FROM orders WHERE cart_id IN (SELECT id FROM cart WHERE listing_id = ?)';
  db.query(deleteOrdersQuery, [listingId], (err) => {
    if (err) throw err;

    // Şimdi, cart kaydını silebiliriz
    const deleteCartQuery = 'DELETE FROM cart WHERE listing_id = ?';
    db.query(deleteCartQuery, [listingId], (err) => {
      if (err) throw err;

      // Son olarak, listing kaydını silebiliriz
      const deleteListingQuery = 'DELETE FROM listings WHERE id = ? AND user_id = ?';
      db.query(deleteListingQuery, [listingId, req.session.user.id], (err) => {
        if (err) throw err;
        res.redirect('/user/dashboard'); // Dashboard'a yönlendir
      });
    });
  });
});


module.exports = router;
