// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// authRouter.js
router.get('/login', (req, res) => {
    res.render('login', { title: 'Giriş Yap', user: req.session.user });
});


// Giriş İşlemi
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.user = results[0];
            if (results[0].role === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/user/dashboard');
            }
        } else {
            res.send('Hatalı kullanıcı adı veya şifre');
        }
    });
});

// Kayıt Sayfası
router.get('/register', (req, res) => {
    res.render('register', { title: 'Giriş Yap', user: req.session.user });
});

router.post('/register', (req, res) => {
    const { username, password, role, first_name, last_name, gender } = req.body;
    db.query(
        'INSERT INTO users (username, password, role, first_name, last_name, gender) VALUES (?, ?, ?, ?, ?, ?)', 
        [username, password, role || 'user', first_name, last_name, gender], 
        (err) => {
            if (err) throw err;
            res.redirect('/auth/login');
        }
    );
});

// Çıkış İşlemi (Logout)
router.get('/logout', (req, res) => {
    // Oturumu sonlandır
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Çıkış işlemi sırasında hata oluştu.');
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
