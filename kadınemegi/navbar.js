document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const loginLogoutBtn = document.getElementById('loginLogoutBtn');
    
    if (loginLogoutBtn) {
        if (token) {
            loginLogoutBtn.textContent = 'Çıkış Yap'; // Giriş yapıldıysa buton 'Çıkış Yap' olsun
            loginLogoutBtn.addEventListener('click', function() {
                localStorage.removeItem('token'); // Token'ı temizle
                alert('Çıkış yapıldı');
                window.location.href = 'login.html'; // Çıkış yaptıktan sonra giriş sayfasına yönlendir
            });
        } else {
            loginLogoutBtn.textContent = 'Giriş Yap'; // Giriş yapılmadıysa 'Giriş Yap' yazsın
            loginLogoutBtn.addEventListener('click', function() {
                window.location.href = 'login.html'; // Giriş sayfasına yönlendir
            });
        }
    }
});
