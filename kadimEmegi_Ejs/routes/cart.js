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


// Sepetten Ürün Silme (POST)
router.post('/remove', (req, res) => {
  const cartId = req.body.cartId;  // Formdan gelen cartId

  // İlk olarak orders tablosundaki ilgili kaydı silelim
  const deleteOrderQuery = 'DELETE FROM orders WHERE cart_id = ?';
  db.query(deleteOrderQuery, [cartId], (err) => {
    if (err) {
      console.error('Orders tablosu silinirken hata:', err);
      return res.status(500).send('Bir hata oluştu');
    }

    // Ardından cart tablosundaki ilgili ürünü silelim
    const deleteCartQuery = 'DELETE FROM cart WHERE id = ?';
    db.query(deleteCartQuery, [cartId], (err) => {
      if (err) {
        console.error('Cart tablosu silinirken hata:', err);
        return res.status(500).send('Bir hata oluştu');
      }

      // Silme işlemi başarılıysa, kullanıcıyı sepet sayfasına yönlendirelim
      res.redirect('/user/dashboard');
    });
  });
});



module.exports = router;
