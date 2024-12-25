const express = require('express');
const router = express.Router();
const db = require('../db');

// Ödeme ve Sipariş
router.post('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { cart_id, payment_method, shipping_address } = req.body;
  const userId = req.session.user.id;

  db.query(
    'INSERT INTO orders (user_id, cart_id, payment_method, shipping_address) VALUES (?, ?, ?, ?)',
    [userId, cart_id, payment_method, shipping_address],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

module.exports = router;
