// Цей код відповідає за відкриття та закриття попапу для входу адміністратора,
// а також за надсилання запиту на сервер для перевірки облікових даних
// адміністратора, отриманих з форми входу. При введенні правильного
// логіну та паролю користувач буде перенаправлений на сторінку адміністратора.
// У разі невірних даних відображається повідомлення про помилку.

function openAdminLoginPopup() {
    document.getElementById('adminLoginPopup').style.display = 'block';
}

function closeAdminLoginPopup() {
    document.getElementById('adminLoginPopup').style.display = 'none';
}

document.getElementById('adminLoginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const login = document.getElementById('adminLogin').value;
    const password = document.getElementById('adminPassword').value;

    fetch('/admin_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/admin_page';
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
