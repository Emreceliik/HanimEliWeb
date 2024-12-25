const express = require('express');
const router = express.Router();
const db = require('../db');

// Mesaj Gönderme (POST)
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

// Mesajları Listeleme (GET)
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;

  // Kullanıcının aldığı ve gönderdiği mesajları listele
  db.query(
    `(SELECT m.id, m.content, m.sent_at, u.username AS sender_username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = ? ORDER BY m.sent_at DESC)
     UNION ALL
     (SELECT m.id, m.content, m.sent_at, u.username AS receiver_username FROM messages m JOIN users u ON m.receiver_id = u.id WHERE m.sender_id = ? ORDER BY m.sent_at DESC)`,
    [userId, userId],
    (err, messages) => {
      if (err) throw err;
      res.render('messages', { messages , title:'Mesajlar' , user: req.session.user || null});
    }
  );
  
});

module.exports = router;
