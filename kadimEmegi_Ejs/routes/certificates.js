const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Yükleme klasörü
const uploadsDir = path.join(__dirname, '../public/uploads');

// Klasörün var olup olmadığını kontrol et ve yoksa oluştur
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Tüm dosyaları uploads altında kaydet
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dosya adını zaman damgası ile benzersiz yap
  },
});
const upload = multer({ storage: storage });

// Sertifika Yükleme Sayfası
router.get('/upload', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('certificates/upload', { title: 'Sertifika', user: req.session.user });
});

// Sertifika Yükleme İşlemi
router.post('/upload', upload.single('certificate'), (req, res) => {
  const { certificate_name } = req.body;
  const userId = req.session.user.id;
  const certificatePath = req.file ? '/uploads/' + req.file.filename : null;

  db.query(
    'INSERT INTO certificates (user_id, certificate_name, certificate_path) VALUES (?, ?, ?)',
    [userId, certificate_name, certificatePath],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

// Sertifika Silme Rotası
router.get('/:id/delete', (req, res) => {
  const certificateId = req.params.id;
  const userId = req.session.user ? req.session.user.id : null;

  if (!userId) {
    return res.redirect('/auth/login');
  }

  // Sertifika bilgisini veritabanından al ve dosyayı sil
  db.query('SELECT certificate_path FROM certificates WHERE id = ? AND user_id = ?', [certificateId, userId], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).send('Sertifika bulunamadı veya yetkiniz yok.');
    }

    const certificatePath = path.join(__dirname, '../public', results[0].certificate_path);

    // Dosyayı sil
    fs.unlink(certificatePath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Dosya silinirken hata oluştu:', err);
        return res.status(500).send('Sertifika dosyası silinemedi.');
      }

      // Veritabanından sertifikayı sil
      db.query('DELETE FROM certificates WHERE id = ? AND user_id = ?', [certificateId, userId], (err) => {
        if (err) throw err;
        res.redirect('/user/dashboard');
      });
    });
  });
});

module.exports = router;
