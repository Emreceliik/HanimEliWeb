const express = require('express');
const router = express.Router();
const db = require('../db');

// Kullanıcı Paneli (Dashboard)
router.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    
    const userId = req.session.user.id;

    // Kullanıcıya ait ilanlar
    db.query('SELECT * FROM listings WHERE user_id = ?', [userId], (err, listings) => {
        if (err) throw err;

        // Kullanıcıya ait sertifikalar
        db.query('SELECT * FROM certificates WHERE user_id = ?', [userId], (err, certificates) => {
            if (err) throw err;

            // Kullanıcıya ait sepet
            db.query('SELECT * FROM cart WHERE user_id = ?', [userId], (err, cartItems) => {
                if (err) throw err;

                // Kullanıcıya ait mesajlar
                db.query('SELECT * FROM messages WHERE receiver_id = ?', [userId], (err, messages) => {
                    if (err) throw err;
                    res.render('user_dashboard', {
                        user: req.session.user,
                        listings,
                        certificates,
                        cartItems,
                        messages
                    });
                });
            });
        });
    });
});

// Diğer yönlendirmeler...
module.exports = router;
