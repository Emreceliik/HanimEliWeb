const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db'); // Veritabanı bağlantısı

// Router dosyaları
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const listingsRouter = require('./routes/listings');
const cartRouter = require('./routes/cart');
const messagesRouter = require('./routes/messages');
const certificatesRouter = require('./routes/certificates');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Veritabanı bağlantısı
db.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantısı başarısız:', err);
  } else {
    console.log('Veritabanı bağlantısı başarılı.');
  }
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/listings', listingsRouter);
app.use('/cart', cartRouter);
app.use('/messages', messagesRouter);
app.use('/certificates', certificatesRouter);
app.use('/orders', ordersRouter);

// 404 Sayfası
app.use((req, res) => {
  res.status(404).render('404', { user: req.session.user || null });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
