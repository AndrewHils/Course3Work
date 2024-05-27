// Додає обробник подій для кожного вибору статусу замовлення
document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', function() {
        const orderId = this.dataset.orderId; // Отримує ідентифікатор замовлення з атрибуту dataset
        const status = this.value; // Отримує значення нового статусу замовлення
        fetch(`/update_order_status/${orderId}`, { // Виконує запит на сервер для оновлення статусу замовлення
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Встановлює заголовок Content-Type для запиту
            },
            body: JSON.stringify({ status }), // Відправляє дані у форматі JSON на сервер
        })
            .then(response => response.json()) // Перетворює отриману відповідь у форматі JSON
            .then(data => {
                if (data.success) {
                    alert('Order status updated successfully'); // Повідомляє про успішне оновлення статусу
                } else {
                    alert('Error updating order status'); // Повідомляє про помилку оновлення статусу
                }
            })
            .catch(error => {
                console.error('Error:', error); // Виводить помилку у випадку невдалого запиту
                alert('Error updating order status'); // Повідомляє про помилку оновлення статусу
            });
    });
});

// Додає обробник подій для кожної кнопки видалення замовлення
document.querySelectorAll('.delete-order-btn').forEach(button => {
    button.addEventListener('click', function() {
        const orderId = this.dataset.orderId; // Отримує ідентифікатор замовлення з атрибуту dataset
        if (confirm('Are you sure you want to delete this order?')) { // Питає користувача підтвердження видалення
            fetch(`/delete_order/${orderId}`, { // Виконує запит на сервер для видалення замовлення
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', // Встановлює заголовок Content-Type для запиту
                },
            })
                .then(response => response.json()) // Перетворює отриману відповідь у форматі JSON
                .then(data => {
                    if (data.success) {
                        alert('Order deleted successfully'); // Повідомляє про успішне видалення замовлення
                        window.location.reload(); // Перезавантажує сторінку для оновлення списку замовлень
                    } else {
                        alert('Error deleting order'); // Повідомляє про помилку видалення замовлення
                    }
                })
                .catch(error => {
                    console.error('Error:', error); // Виводить помилку у випадку невдалого запиту
                    alert('Error deleting order'); // Повідомляє про помилку видалення замовлення
                });
        }
    });
});
