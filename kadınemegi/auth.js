document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const password = document.getElementById('password').value;

    // Backend'e form gönderimi simülasyonu
    if (nickname === 'demo' && password === '1234') {
        localStorage.setItem('isAuthenticated', true);
        alert('Başarıyla giriş yaptınız!');
        redirectTo('index.html');
    } else {
        alert('Kullanıcı adı veya şifre hatalı!');
    }
});
