const express = require('express');
const router = express.Router();
const db = require('../db');

// Ödeme Sayfası (GET)
router.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;

  // Sepetteki ürünlerin bilgilerini alıyoruz
  db.query(
    'SELECT c.id, c.quantity, l.title, l.price, l.image_path FROM cart c JOIN listings l ON c.listing_id = l.id WHERE c.user_id = ?',
    [userId],
    (err, cartItems) => {
      if (err) throw err;

      // Kullanıcının sepetinde ürün var mı?
      if (cartItems.length > 0) {
        // Sepetteki ürünleri ve toplam tutarı gönderiyoruz
        let totalPrice = 0;
        cartItems.forEach(item => {
          totalPrice += item.price * item.quantity;
        });

        res.render('orders/checkout', {
          title: 'Ödeme ve Sipariş',
          cartItems: cartItems,
          totalPrice: totalPrice,
          user: req.session.user || null
        });
      } else {
        res.redirect('/cart'); // Eğer sepette ürün yoksa, sepet sayfasına yönlendir
      }
    }
  );
});



// Ödeme ve Sipariş (POST)
router.post('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { shipping_address, payment_method } = req.body;
  const userId = req.session.user.id;

  // Sepetteki ürünlerin bilgilerini alıyoruz
  db.query(
    'SELECT id FROM cart WHERE user_id = ?',
    [userId],
    (err, cartItems) => {
      if (err) throw err;

      // Sepetteki ürünleri kontrol ediyoruz
      if (cartItems.length > 0) {
        const cart_id = cartItems[0].id;

        // Sipariş veritabanına ekliyoruz
        db.query(
          'INSERT INTO orders (user_id, cart_id, payment_method, shipping_address, order_status) VALUES (?, ?, ?, ?, ?)',
          [userId, cart_id, payment_method, shipping_address, 'pending'], // 'pending' gibi bir durum ekliyoruz
          (err, result) => {
            if (err) throw err;

            // Sipariş başarıyla verildiğinde, sepetin durumunu 'completed' olarak güncelliyoruz
            db.query(
              'UPDATE orders SET order_status = ? WHERE cart_id = ?',
              ['completed', cart_id],
              (err) => {
                if (err) throw err;

                // Kullanıcıyı dashboard'a yönlendiriyoruz
                res.redirect('/user/dashboard');
              }
            );
          }
        );
      } else {
        // Sepette ürün yoksa, sepet sayfasına yönlendiriyoruz
        res.redirect('/cart');
      }
    }
  );
});



module.exports = router;
