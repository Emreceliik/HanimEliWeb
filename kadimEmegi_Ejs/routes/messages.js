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

// Mesaja Cevap Gönderme (POST)
router.post('/reply', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { message_id, content } = req.body;
  const senderId = req.session.user.id;

  // Mesajı alıcı olarak güncelle
  db.query(
    'SELECT * FROM messages WHERE id = ?',
    [message_id],
    (err, result) => {
      if (err) throw err;
      
      const originalMessage = result[0];
      const receiverId = originalMessage.sender_id;

      // Cevap mesajını ekle
      db.query(
        'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
        [senderId, receiverId, content],
        (err) => {
          if (err) throw err;
          res.redirect('/user/dashboard');
        }
      );
    }
  );
});


// Mesajları Listeleme (GET)
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;

  // Gelen mesajları al
  db.query(
    'SELECT m.id, m.content, m.sent_at, u.username AS sender_username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = ? ORDER BY m.sent_at DESC',
    [userId],
    (err, receivedMessages) => {
      if (err) throw err;

      // Giden mesajları al
      db.query(
        'SELECT m.id, m.content, m.sent_at, u.username AS receiver_username FROM messages m JOIN users u ON m.receiver_id = u.id WHERE m.sender_id = ? ORDER BY m.sent_at DESC',
        [userId],
        (err, sentMessages) => {
          if (err) throw err;

          // Dashboard render
          res.render('user_dashboard', {
            title: 'Kullanıcı Paneli',
            user: req.session.user,
            messages: {
              received: receivedMessages,
              sent: sentMessages
            }
          });
        }
      );
    }
  );
});


module.exports = router;
