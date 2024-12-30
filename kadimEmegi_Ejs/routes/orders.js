const express = require('express');
const router = express.Router();
const db = require('../db');

// // Ödeme Sayfası (GET)
// router.get('/checkout', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/auth/login');
//   }

//   const userId = req.session.user.id;

//   // Sepetteki ürünlerin bilgilerini alıyoruz
//   db.query(
//     'SELECT c.id, c.quantity, l.title, l.price, l.image_path FROM cart c JOIN listings l ON c.listing_id = l.id WHERE c.user_id = ?',
//     [userId],
//     (err, cartItems) => {
//       if (err) throw err;

//       // Kullanıcının sepetinde ürün var mı?
//       if (cartItems.length > 0) {
//         // Sepetteki ürünleri ve toplam tutarı gönderiyoruz
//         let totalPrice = 0;
//         cartItems.forEach(item => {
//           totalPrice += item.price * item.quantity;
//         });

//         res.render('orders/checkout', {
//           title: 'Ödeme ve Sipariş',
//           cartItems: cartItems,
//           totalPrice: totalPrice,
//           user: req.session.user || null
//         });
//       } else {
//         res.redirect('/cart'); // Eğer sepette ürün yoksa, sepet sayfasına yönlendir
//       }
//     }
//   );
// });



// // Ödeme ve Sipariş (POST)
// router.post('/checkout', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/auth/login');
//   }

//   const { shipping_address, payment_method } = req.body;
//   const userId = req.session.user.id;

//   // Sepetteki ürünlerin bilgilerini alıyoruz
//   db.query(
//     'SELECT c.id, c.listing_id, c.quantity, l.price FROM cart c JOIN listings l ON c.listing_id = l.id WHERE c.user_id = ?',
//     [userId],
//     (err, cartItems) => {
//       if (err) throw err;

//       // Sepetteki ürünleri kontrol ediyoruz
//       if (cartItems.length > 0) {
//         // Sipariş veritabanına ekliyoruz
//         cartItems.forEach(item => {
//           // Her ürün için orders tablosuna ekleme yapıyoruz
//           db.query(
//             'INSERT INTO orders (user_id, cart_id, payment_method, shipping_address, order_status, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
//             [
//               userId,
//               item.id, // Sepet ID'sini cart_id olarak kaydediyoruz
//               payment_method,
//               shipping_address,
//               'pending', // Sipariş durumu, ödeme yapılana kadar 'pending'
//               item.price,
//               item.quantity
//             ],
//             (err) => {
//               if (err) throw err;
//             }
//           );
//         });

//         // Sipariş başarıyla verildiğinde, kullanıcıyı dashboard'a yönlendiriyoruz
//         res.redirect('/user/dashboard');
//       } else {
//         // Sepette ürün yoksa, sepet sayfasına yönlendiriyoruz
//         res.redirect('/cart');
//       }
//     }
//   );
// });

// Ödeme ve Sipariş (POST)
router.post('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const { shipping_address, payment_method } = req.body;
  const userId = req.session.user.id;

  // Siparişin benzersiz bir order_group_id'sini oluşturuyoruz
  const orderGroupId = 'ORD' + Date.now();  // Benzersiz order_group_id oluşturmak için timestamp kullanıyoruz.

  // Sepetteki ürünlerin bilgilerini alıyoruz
  db.query(
    'SELECT c.id, c.listing_id, c.quantity, l.price FROM cart c JOIN listings l ON c.listing_id = l.id WHERE c.user_id = ?',
    [userId],
    (err, cartItems) => {
      if (err) throw err;

      // Sepetteki ürünleri kontrol ediyoruz
      if (cartItems.length > 0) {
        // Sipariş veritabanına ekliyoruz
        cartItems.forEach(item => {
          // Her ürün için orders tablosuna ekleme yapıyoruz
          db.query(
            'INSERT INTO orders (user_id, cart_id, order_group_id, payment_method, shipping_address, order_status, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              userId,
              item.id, // Sepet ID'sini cart_id olarak kaydediyoruz
              orderGroupId, // Her sipariş için aynı order_group_id'yi yazıyoruz
              payment_method,
              shipping_address,
              'pending', // Sipariş durumu, ödeme yapılana kadar 'pending'
              item.price,
              item.quantity
            ],
            (err) => {
              if (err) throw err;
            }
          );
        });

        // Sipariş başarıyla verildiğinde, kullanıcıyı dashboard'a yönlendiriyoruz
        res.redirect('/user/dashboard');
      } else {
        // Sepette ürün yoksa, sepet sayfasına yönlendiriyoruz
        res.redirect('/cart');
      }
    }
  );
});


// Ödeme Sayfası (GET)
router.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  const userId = req.session.user.id;

  // Kullanıcının siparişlerini ve ürünlerini order_group_id'ye göre grupluyoruz
  db.query(
    'SELECT o.id AS order_id, o.order_group_id, o.payment_method, o.shipping_address, o.order_status, o.price, o.quantity, l.title, l.image_path ' +
    'FROM orders o ' +
    'JOIN listings l ON o.cart_id = l.id ' +
    'WHERE o.user_id = ? ORDER BY o.order_group_id',
    [userId],
    (err, orders) => {
      if (err) throw err;

      // Siparişleri order_group_id'ye göre gruplayıp tek bir sipariş içinde topluyoruz
      const groupedOrders = orders.reduce((acc, order) => {
        const groupId = order.order_group_id;
        if (!acc[groupId]) {
          acc[groupId] = [];
        }
        acc[groupId].push(order);
        return acc;
      }, {});

      // Sepetteki ürünlerin bilgilerini alıyoruz
      db.query(
        'SELECT c.id, c.quantity, l.title, l.price, l.image_path FROM cart c JOIN listings l ON c.listing_id = l.id WHERE c.user_id = ?',
        [userId],
        (err, cartItems) => {
          if (err) throw err;

          // Kullanıcının sepetinde ürün var mı?
          if (cartItems.length > 0) {
            let totalPrice = 0;
            cartItems.forEach(item => {
              totalPrice += item.price * item.quantity;
            });

            res.render('orders/checkout', {
              title: 'Ödeme ve Sipariş',
              cartItems: cartItems,
              totalPrice: totalPrice,
              orders: groupedOrders,
              user: req.session.user || null
            });
          } else {
            res.redirect('/cart'); // Eğer sepette ürün yoksa, sepet sayfasına yönlendir
          }
        }
      );
    }
  );
});

// // Siparişleri Listeleme (GET)
// router.get('/orders', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/auth/login');
//   }

//   const userId = req.session.user.id;

//   // Kullanıcının siparişlerini ve ürünlerini order_group_id'ye göre grupluyoruz ve user_id ile order_group_id'yi eşliyoruz
//   db.query(
//     'SELECT o.id AS order_id, o.order_group_id, o.payment_method, o.shipping_address, o.order_status, o.price, o.quantity, l.title, l.image_path ' + 
//     'FROM orders o ' +
//     'JOIN listings l ON o.cart_id = l.id ' +
//     'WHERE o.user_id = ? AND o.order_group_id IN (SELECT order_group_id FROM orders WHERE user_id = ?) ' +
//     'ORDER BY o.order_group_id',
//     [userId, userId], // Aynı user_id ile order_group_id'yi eşliyoruz
//     (err, orders) => {
//       if (err) throw err;

//       // Siparişleri order_group_id'ye göre gruplayıp tek bir sipariş içinde topluyoruz
//       const groupedOrders = orders.reduce((acc, order) => {
//         const groupId = order.order_group_id;
//         if (!acc[groupId]) {
//           acc[groupId] = [];
//         }
//         acc[groupId].push(order);
//         return acc;
//       }, {});

//       res.render('orders/list', {
//         orders: groupedOrders,
//         user: req.session.user || null
//       });
//     }
//   );
// });



module.exports = router;
