const express = require('express');
const router = express.Router();
const db = require('../db');
const path = require('path');
const multer = require('multer');
const { title } = require('process');

// Multer ayarları (sertifika yükleme)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/certificates/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Sertifika Yükleme Sayfası
router.get('/upload', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('certificates/upload', {title: 'Sertifika', user: req.session.user });
});

// Sertifika Yükleme İşlemi
router.post('/upload', upload.single('certificate'), (req, res) => {
  const { certificate_name } = req.body;
  const userId = req.session.user.id;
  const certificatePath = req.file ? '/uploads/certificates/' + req.file.filename : null;

  db.query(
    'INSERT INTO certificates (user_id, certificate_name, certificate_path) VALUES (?, ?, ?)',
    [userId, certificate_name, certificatePath],
    (err) => {
      if (err) throw err;
      res.redirect('/user/dashboard');
    }
  );
});

module.exports = router;
