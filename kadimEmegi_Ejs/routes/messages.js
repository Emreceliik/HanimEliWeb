const express = require('express');
const router = express.Router();
const db = require('../db');

// Mesaj Gönderme
router.post('/send', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { receiver_id, content } = req.body;
  const senderId = req.session.user.id;

  db.query(
    'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
    [senderId, receiver_id, content],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

module.exports = router;
