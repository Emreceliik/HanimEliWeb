const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'); // Render the index page
});

module.exports = router;
