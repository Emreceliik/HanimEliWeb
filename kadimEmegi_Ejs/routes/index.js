// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Ana Sayfa', user: req.session.user || null });
});

module.exports = router;
