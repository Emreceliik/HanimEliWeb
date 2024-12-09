const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Veritabanı bağlantısı dosyasını dahil et
const jwt = require('jsonwebtoken'); // JWT modülünü dahil et
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // JWT sırrı

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Kullanıcı profili rotası
app.get('/api/users/profile', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token bulunamadı.' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Token'ı doğrula ve içeriğini al
        const query = `SELECT * FROM kullanicilar WHERE kullanici_id = $1;`;
        const result = await pool.query(query, [decoded.nickname]);

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Sunucu hatası!' });
    }
});

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

// Kullanıcı giriş rotası
app.post('/login', async (req, res) => {
    const { nickname, password } = req.body;

    try {
        const query = `SELECT * FROM kullanicilar WHERE kullanici_id = $1 AND sifre = $2;`;
        const values = [nickname, password];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const token = jwt.sign({ nickname: user.kullanici_id }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: 'Giriş başarılı!', token });
        } else {
            res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı!' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Sunucu hatası!' });
    }
});

// Kullanıcı rotalarını dışarıya aç
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Sunucuyu dinleme
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
