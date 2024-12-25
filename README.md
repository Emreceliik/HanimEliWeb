
# 🧶 Kadin Emegi - El Yapımı Ürün Pazaryeri

**Kadin Emegi**'ne hoş geldiniz! Kadın girişimcilerin ev yapımı ürünlerini satabilecekleri eşsiz bir e-ticaret platformu. Ev yemekleri, örgüler, boncuklar ve çantalar gibi çeşitli el yapımı ürünler burada satışa sunuluyor. 💪💖

## 🚀 Özellikler

- **Ürün Listeleri:** Satıcılar, el yapımı ürünlerini yükleyip yönetebilir.
- **Kullanıcı Kimlik Doğrulama:** Güvenli kayıt ve giriş işlemleri.
- **Alışveriş Sepeti:** Ürünleri sepete ekleyebilir ve ödeme işlemi gerçekleştirebilirsiniz.
- **Mesajlaşma:** Kullanıcılar satıcılarla iletişim kurabilir.
- **Admin Paneli:** Adminler, kullanıcıları yönetebilir, ürün onayı yapabilir ve siparişleri görüntüleyebilir.
- **Ödeme Seçenekleri:** Kredi Kartı, PayPal ve Kapıda Ödeme gibi çeşitli ödeme yöntemleri.

## 📦 Kurulum

1. Reponunuzu klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/kadin-emegi.git
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   cd kadin-emegi
   npm install
   ```

3. Ortam değişkenleri için bir `.env` dosyası oluşturun (örneğin, veritabanı bilgileri, oturum gizliliği):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=kadin_emegi
   SESSION_SECRET=oturum-gizliligi
   ```

4. Sunucuyu başlatın:
   ```bash
   npm start
   ```

5. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek platformu ziyaret edebilirsiniz.

## 💡 Teknoloji Yığını

- **Frontend:** EJS, HTML5, CSS3 (özel modern tasarım)
- **Backend:** Node.js, Express
- **Veritabanı:** MySQL
- **Kimlik Doğrulama:** Passport.js
- **Dosya Depolama:** Görseller için yerel depolama

## 🎨 UI/UX

Platform, **temiz**, **simetrik** ve **modern** bir tasarıma sahiptir, böylece mükemmel bir kullanıcı deneyimi sunar. Mobil uyumlu düzen sayesinde tüm cihazlarda sorunsuz çalışır.

## ⚙️ Fonksiyonalite

### 🛒 Sepet Yönetimi
Kullanıcılar ürünleri sepete ekleyebilir, miktarlarını güncelleyebilir veya silebilir. Sepet, ödeme işlemine kadar saklanır.

### 📦 Ürün Yönetimi
Satıcılar, ürünlerini kolayca ekleyebilir, güncelleyebilir ve silebilir. Adminler ürünleri onaylayabilir ve silebilir.

### 💬 Mesajlaşma Sistemi
Alıcılar ve satıcılar arasında kolayca mesajlaşılabilir.

### 🏆 Admin Paneli
Adminler, ürünleri, kullanıcıları ve siparişleri yönetebilir, ürünleri onaylayabilir ve siparişleri izleyebilir.

## 🛠️ Kurulum

### Veritabanı Kurulumu

1. Veritabanı için bir MySQL veritabanı oluşturun.
2. Aşağıdaki yapıyı içeren tabloları oluşturun:
   - **users** (kullanıcı bilgileri)
   - **listings** (ürün listeleri)
   - **cart** (alışveriş sepeti)
   - **orders** (sipariş bilgileri)
   - **messages** (mesajlaşma)

### Uygulama Çalıştırma

- Veritabanınızın çalıştığından emin olun.
- Node.js uygulamasını `npm start` komutuyla başlatın ve [http://localhost:3000](http://localhost:3000) adresinden platforma erişin.

## 🧑‍💻 Katkıda Bulunma

Bu repoyu forkladığınızda, sorunları bildirebilir veya pull request (çekme isteği) gönderebilirsiniz. Katkılarınız her zaman hoş karşılanır! 🎉

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

---

### 🧵 Bize Ulaşın


- Twitter: [@kadinemegi](https://twitter.com/kadinemegi)
- LinkedIn: [Kadin Emegi](https://linkedin.com/kadinemegi)

Kadin Emegi'ni incelediğiniz için teşekkürler! 🙌
