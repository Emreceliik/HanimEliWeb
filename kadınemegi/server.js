// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kullanıcı kayıt rotası
app.post('/register', async (req, res) => {
    const { nickname, password, confirmPassword, email, gender } = req.body;

    // Şifrelerin eşleştiğini kontrol et
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Şifreler eşleşmiyor.' });
    }

    try {
        const kayitTarihi = new Date();

        const query = `
            INSERT INTO kullanicilar (kullanici_id, sifre, sifre_tekrar, e_posta, cinsiyet, kayıt_tarihi)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [nickname, password, confirmPassword, email, gender, kayitTarihi];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi!', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Sunucu hatası!' });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
