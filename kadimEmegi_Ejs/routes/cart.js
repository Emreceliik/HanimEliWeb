const express = require('express');
const router = express.Router();
const db = require('../db');

// Sepete Ürün Ekleme
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

module.exports = router;
