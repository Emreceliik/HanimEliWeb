const express = require('express');
const router = express.Router();
const db = require('../db');

// Kullanıcı Dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;

  // Kullanıcının ilanları
  const userListingsQuery = 'SELECT * FROM listings WHERE user_id = ?';

  // Tüm ilanlar (onaylı olanlar)
  const allListingsQuery = `
  SELECT l.*, u.username 
  FROM listings l 
  JOIN users u ON l.user_id = u.id 
  WHERE l.approved = 1 
  ORDER BY l.created_at DESC
`;


  // Kullanıcının sertifikaları
  const certificatesQuery = 'SELECT * FROM certificates WHERE user_id = ?';

// Kullanıcının sepetindeki ürünler
const cartItemsQuery = `
  SELECT c.*, l.title, l.price, l.image_path
  FROM cart c 
  JOIN listings l ON c.listing_id = l.id 
  WHERE c.user_id = ?
`;


  // Kullanıcının mesajları (gönderilen ve alınan)
  const messagesQuery = `
    SELECT m.*, u.username AS sender_username 
    FROM messages m 
    JOIN users u ON m.sender_id = u.id 
    WHERE m.sender_id = ? OR m.receiver_id = ?
    ORDER BY m.sent_at DESC
  `;

  // Tüm sorguların paralel çalıştırılması
  db.query(userListingsQuery, [userId], (err, userListings) => {
    if (err) throw err;

    db.query(allListingsQuery, (err, allListings) => {
      if (err) throw err;

      db.query(certificatesQuery, [userId], (err, certificates) => {
        if (err) throw err;

        db.query(cartItemsQuery, [userId], (err, cartItems) => {
          if (err) throw err;

          db.query(messagesQuery, [userId, userId], (err, messages) => {
            if (err) throw err;

            // Dashboard render
            res.render('user_dashboard', {
              title: 'Kullanıcı Paneli',
              user: req.session.user,
              userListings: userListings,
              allListings: allListings,
              certificates: certificates,
              cartItems: cartItems,
              messages: messages,
            });
          });
        });
      });
    });
  });
});

module.exports = router;
