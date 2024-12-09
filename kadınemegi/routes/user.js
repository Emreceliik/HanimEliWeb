const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const router = express.Router();

// PostgreSQL bağlantısı
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Kullanıcı profili rotası
router.get('/profile', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Token'ı al
    if (!token) {
        return res.status(401).json({ message: 'Token bulunamadı!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token'ı doğrula
        const userId = decoded.nickname;  // Kullanıcı kimliğini almak için nickname kullan

        // Kullanıcıyı veritabanından 'kullanici_id' ile al
        const result = await pool.query('SELECT * FROM kullanicilar WHERE kullanici_id = $1', [userId]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            res.json({
                username: user.kullanici_id,  // Kullanıcı adı
                email: user.e_posta,         // Kullanıcı e-posta
                gender: user.cinsiyet,       // Cinsiyet
                fullName: user.isim,         // İsim + soyisim
                registration_date: user.kayıt_tarihi, // Kayıt tarihi
            });
        } else {
            res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Bir hata oluştu.' });
    }
});

module.exports = router;
