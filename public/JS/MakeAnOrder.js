// Цей скрипт додає обробник подій для відправки форми замовлення. Він перехоплює подію submit форми, запобігаючи її стандартній обробці.
// Потім він отримує значення полів форми (ім'я, електронна пошта, телефон, адреса) та дані кошика з localStorage.
// Після цього він відправляє POST-запит на сервер з цими даними, використовуючи метод fetch.
// Якщо сервер успішно обробить запит, він відображає повідомлення про успішне замовлення, очищає кошик у localStorage та перенаправляє користувача на головну сторінку.
// У випадку невдалого замовлення виводиться повідомлення про помилку.

document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    fetch('/submit-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, address, cart: JSON.parse(localStorage.getItem('cart')) })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Замовлення успішно зроблено! Очікуйте дзвінка від оператора');
                localStorage.removeItem('cart');
                window.location.href = '/';
            } else {
                alert('Помилка при оформленні замовлення. Спробуйте ще раз.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Помилка при оформленні замовлення. Спробуйте ще раз.');
        });
});
