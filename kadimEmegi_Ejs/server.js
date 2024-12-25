const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const db = require('./db'); // Veritabanı bağlantısı
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', indexRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
