function redirectTo(url) {
    window.location.href = url;
}

function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
        redirectTo('login.html');
    }
}

function show404() {
    document.body.innerHTML = '<h1>404 - Sayfa Bulunamadı</h1>';
}
