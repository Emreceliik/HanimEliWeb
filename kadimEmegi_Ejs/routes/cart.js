const express = require('express');
const router = express.Router();
const db = require('../db');

// Sepete Ürün Ekleme (POST)
router.post('/add', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { listing_id, quantity } = req.body;
  const userId = req.session.user.id;

  db.query(
    'INSERT INTO cart (user_id, listing_id, quantity) VALUES (?, ?, ?)',
    [userId, listing_id, quantity],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

// Sepet Sayfası (GET)
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;

  db.query(
    'SELECT c.id, c.quantity, l.title, l.price FROM cart c JOIN listings l ON c.listing_id = l.id WHERE c.user_id = ?',
    [userId],
    (err, cartItems) => {
      if (err) throw err;
      res.render('cart', {title: 'Ana Sayfa', cartItems ,user: req.session.user || null});
    }
  );
});

module.exports = router;
