const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL bağlantısı dosyası

// Admin Dashboard
router.get('/dashboard', (req, res) => {
    // Onaylanmayı bekleyen ilanları getir
    db.query(
        'SELECT * FROM listings WHERE approved = FALSE',
        (err, results) => {
            if (err) {
                console.error('Hata:', err);
                return res.status(500).send('Veritabanı hatası.');
            }
            res.render('admin_dashboard', { pendingListings: results,  user: req.session.user || null });
        }
    );
});

// Kullanıcıları Yönet
router.get('/manage-users', (req, res) => {
    // Tüm kullanıcıları getir
    db.query('SELECT id, username, first_name, last_name, role FROM users', (err, results) => {
        if (err) {
            console.error('Hata:', err);
            return res.status(500).send('Veritabanı hatası.');
        }
        res.render('manage_users', { users: results ,  user: req.session.user || null});
    });
});

// İlanları Onayla
router.post('/approve-listing/:id', (req, res) => {
    const listingId = req.params.id;

    db.query(
        'UPDATE listings SET approved = TRUE WHERE id = ?',
        [listingId],
        (err) => {
            if (err) {
                console.error('Hata:', err);
                return res.status(500).send('Veritabanı hatası.');
            }
            res.redirect('/admin/dashboard');
        }
    );
});

// İlanları Sil
router.post('/delete-listing/:id', (req, res) => {
    const listingId = req.params.id;

    db.query('DELETE FROM listings WHERE id = ?', [listingId], (err) => {
        if (err) {
            console.error('Hata:', err);
            return res.status(500).send('Veritabanı hatası.');
        }
        res.redirect('/admin/dashboard');
    });
});

// Kullanıcıyı Sil
router.post('/delete-user/:id', (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error('Hata:', err);
            return res.status(500).send('Veritabanı hatası.');
        }
        res.redirect('/admin/manage-users');
    });
});

module.exports = router;
