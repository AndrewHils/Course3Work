// Надсилання запиту на сервер при натисканні кнопки "Відправити" на формі контактів.
// Код отримує дані з полів вводу (ім'я, електронна пошта, телефон та коментар),
// а потім надсилає ці дані на сервер за допомогою методу POST.
// Якщо сервер успішно обробив запит, виводиться повідомлення про успішне відправлення питання.
// У випадку помилки під час надсилання запиту або обробки на сервері, виводиться повідомлення про помилку.

document.querySelector('.question-btn').addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const comment = document.getElementById('comment').value;

    fetch('/submit-contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, comment })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Питання успішно відправлено!');
            } else {
                alert('Помилка при відправленні питання. Спробуйте ще раз.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Помилка при відправленні питання. Спробуйте ще раз.');
        });
});
