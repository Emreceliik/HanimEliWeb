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
  
    // Kullanıcının siparişleri
    const ordersQuery = `
      SELECT o.*, l.title, l.price, l.image_path, (l.price * c.quantity) AS total_price
      FROM orders o
      JOIN cart c ON o.cart_id = c.id
      JOIN listings l ON c.listing_id = l.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
  
    // Kullanıcı bilgilerini almak için sorgu
    const userQuery = 'SELECT * FROM users WHERE id = ?';
  
    // Kullanıcıya ait mesajları alma
    const messagesQuery = `
      (SELECT m.id, m.content, m.sent_at, u.username AS sender_username 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.receiver_id = ? ORDER BY m.sent_at DESC)
       UNION ALL
      (SELECT m.id, m.content, m.sent_at, u.username AS receiver_username 
       FROM messages m 
       JOIN users u ON m.receiver_id = u.id 
       WHERE m.sender_id = ? ORDER BY m.sent_at DESC)
    `;
// Kullanıcıya ait gelen mesajları alma
const receivedMessagesQuery = `
  SELECT m.id, m.content, m.sent_at, u.username AS sender_username 
  FROM messages m 
  JOIN users u ON m.sender_id = u.id 
  WHERE m.receiver_id = ? 
  ORDER BY m.sent_at DESC
`;

// Kullanıcıya ait gönderilen mesajları alma
const sentMessagesQuery = `
  SELECT m.id, m.content, m.sent_at, u.username AS receiver_username 
  FROM messages m 
  JOIN users u ON m.receiver_id = u.id 
  WHERE m.sender_id = ? 
  ORDER BY m.sent_at DESC
`;

    // Tüm sorguları paralel çalıştırma
    db.query(userQuery, [userId], (err, users) => {
        if (err) throw err;
      
        const user = users[0];
      
        db.query(userListingsQuery, [userId], (err, userListings) => {
          if (err) throw err;
      
          db.query(allListingsQuery, (err, allListings) => {
            if (err) throw err;
      
            db.query(certificatesQuery, [userId], (err, certificates) => {
              if (err) throw err;
      
              db.query(cartItemsQuery, [userId], (err, cartItems) => {
                if (err) throw err;
      
                // Separate received and sent messages
                db.query(receivedMessagesQuery, [userId], (err, receivedMessages) => {
                  if (err) throw err;
      
                  db.query(sentMessagesQuery, [userId], (err, sentMessages) => {
                    if (err) throw err;
      
                    db.query(ordersQuery, [userId], (err, orders) => {
                      if (err) throw err;
      
                      res.render('user_dashboard', {
                        title: 'Kullanıcı Paneli',
                        user: user,
                        userListings: userListings,
                        allListings: allListings,
                        certificates: certificates,
                        cartItems: cartItems,
                        receivedMessages: receivedMessages,  // Received messages
                        sentMessages: sentMessages,          // Sent messages
                        orders: orders,  // Siparişler
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  
  
  
 // Profil güncelleme işlemi
router.post('/update-profile', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
  
    const { first_name, last_name, gender } = req.body;
    const userId = req.session.user.id;
  
    const updateQuery = `
      UPDATE users 
      SET first_name = ?, last_name = ?, gender = ? 
      WHERE id = ?
    `;
  
    db.query(updateQuery, [first_name, last_name, gender, userId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Bir hata oluştu.');
      }
  
      // Kullanıcıyı güncel bilgileriyle dashboard'a yönlendiriyoruz
      req.session.user.first_name = first_name;
      req.session.user.last_name = last_name;
      req.session.user.gender = gender;
      
      res.redirect('/user/dashboard');
    });
  });
  
module.exports = router;
