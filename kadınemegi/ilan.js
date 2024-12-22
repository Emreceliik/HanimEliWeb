document.getElementById('ilanForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Formun varsayılan gönderimini engelle

    const formData = new FormData(this); // Formu al
    const data = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        price: formData.get('price'),
        location: formData.get('location'),
        user: 'currentUser', // Giriş yapan kullanıcının bilgileri burada olacak (JWT veya session kullanabilirsiniz)
        image: formData.get('image') // Görseli Base64 veya URL olarak gönderebilirsiniz
    };

    // İlan verisini sunucuya gönder
    try {
        const response = await fetch('/ilanlar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('İlan başarıyla verildi!');
            window.location.href = 'index.html'; // İlan verildikten sonra anasayfaya yönlendir
        } else {
            alert('İlan verirken bir hata oluştu.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Sunucu hatası.');
    }
});
