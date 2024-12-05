document.getElementById('ilanForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    // Backend'e gönderim simülasyonu
    console.log('Form verileri:', Object.fromEntries(formData.entries()));
    alert('İlan başarıyla oluşturuldu!');
    redirectTo('index.html');
});
