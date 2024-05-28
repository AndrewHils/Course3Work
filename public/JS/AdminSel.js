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
//Динамічне завантаження необхідних полів для заповнення нового товару на сторінку Admin
document.addEventListener('DOMContentLoaded', function () {
    const productTypeSelect = document.getElementById('productType');
    const formFieldsDiv = document.getElementById('form-fields');

    const fieldTemplates = {
        Film135Table: `
            <div>
                <label for="FilmName">Назва:</label>
                <input type="text" id="FilmName" name="FilmName" required>
            </div>
            <div>
                <label for="FilmPrise">Ціна:</label>
                <input type="number" id="FilmPrise" name="FilmPrise" required>
            </div>
            <div>
                <label for="FrontPhoto">Фото (URL):</label>
                <input type="text" id="FrontPhoto" name="FrontPhoto" required>
            </div>
            <div>
                <label for="BackPhoto">Заднє фото (URL):</label>
                <input type="text" id="BackPhoto" name="BackPhoto">
            </div>
            <div>
                <label for="FilmBrand">Бренд:</label>
                <select id="FilmBrand" name="FilmBrand" required>
                    <option value="AGFA">AGFA</option>
                    <option value="CineStill">CineStill</option>
                    <option value="Fomapan">Fomapan</option>
                    <option value="FujiFilm">FujiFilm</option>
                    <option value="Ilford">Ilford</option>
                    <option value="Kentmere">Kentmere (by Ilford/Harman)</option>
                    <option value="Kodak">Kodak</option>
                    <option value="Rollei">Rollei</option>
                    <option value="Roll">Намотка</option>
                    <option value="Other">Інші</option>
                </select>
            </div>
            <div>
                <label for="FilmType">Тип:</label>
                <select id="FilmType" name="FilmType" required>
                    <option value="ColorNegative">Кольорова негативна</option>
                    <option value="ColorPositive">Кольорова позитивна (слайд)</option>
                    <option value="BlackWhite">Чорно-біла</option>
                </select>
            </div>
            <div>
                <label for="FilmISO">ISO:</label>
                <input type="text" id="FilmISO" name="FilmISO">
            </div>
            <div>
                <label for="FilmDesc">Опис:</label>
                <textarea id="FilmDesc" name="FilmDesc"></textarea>
            </div>
        `,
        Film120Table: `
            <div>
                <label for="FilmName">Назва:</label>
                <input type="text" id="FilmName" name="FilmName" required>
            </div>
            <div>
                <label for="FilmPrise">Ціна:</label>
                <input type="number" id="FilmPrise" name="FilmPrise" required>
            </div>
            <div>
                <label for="FrontPhoto">Фото (URL):</label>
                <input type="text" id="FrontPhoto" name="FrontPhoto" required>
            </div>
            <div>
                <label for="BackPhoto">Заднє фото (URL):</label>
                <input type="text" id="BackPhoto" name="BackPhoto">
            </div>
            <div>
                <label for="FilmBrand">Бренд:</label>
                <select id="FilmBrand" name="FilmBrand" required>
                    <option value="AGFA">AGFA</option>
                    <option value="CineStill">CineStill</option>
                    <option value="Fomapan">Fomapan</option>
                    <option value="FujiFilm">FujiFilm</option>
                    <option value="Ilford">Ilford</option>
                    <option value="Kentmere">Kentmere (by Ilford/Harman)</option>
                    <option value="Kodak">Kodak</option>
                    <option value="Rollei">Rollei</option>
                    <option value="Roll">Намотка</option>
                    <option value="Other">Інші</option>
                </select>
            </div>
            <div>
                <label for="FilmType">Тип:</label>
                <select id="FilmType" name="FilmType" required>
                    <option value="ColorNegative">Кольорова негативна</option>
                    <option value="ColorPositive">Кольорова позитивна (слайд)</option>
                    <option value="BlackWhite">Чорно-біла</option>
                </select>
            </div>
            <div>
                <label for="FilmISO">ISO:</label>
                <input type="text" id="FilmISO" name="FilmISO">
            </div>
            <div>
                <label for="FilmDesc">Опис:</label>
                <textarea id="FilmDesc" name="FilmDesc"></textarea>
            </div>
        `,
        FilmCams: `
            <div>
                <label for="CamName">Назва:</label>
                <input type="text" id="CamName" name="FilmName" required>
            </div>
            <div>
                <label for="CamPrise">Ціна:</label>
                <input type="number" id="CamPrise" name="FilmPrise" required>
            </div>
            <div>
                <label for="CamFrontPhoto">Фото (URL):</label>
                <input type="text" id="CamFrontPhoto" name="FrontPhoto" required>
            </div>
            <div>
                <label for="CamBackPhoto">Заднє фото (URL):</label>
                <input type="text" id="CamBackPhoto" name="BackPhoto">
            </div>
            <div>
                <label for="CamBrand">Бренд:</label>
                <select id="CamBrand" name="FilmBrand" required>
                    <option value="Canon">Canon</option>
                    <option value="Nikon">Nikon</option>
                    <option value="Olympus">Olympus</option>
                    <option value="Pentax">Pentax</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Ricoh">Ricoh</option>
                    <option value="Leica">Leica</option>
                </select>
            </div>
            <div>
                <label for="CamType">Тип Камери:</label>
                <select id="CamType" name="FilmType" required>
                    <option value="SLRMec">Дзеркальна механічна (SLR)</option>
                    <option value="SLRSemiMec">Дзеркальна напів-автоматична</option>
                    <option value="Rangefinder">Мильниця (Rangefinder)</option>
                    <option value="Instant">Моментальна (Instant)</option>
                </select>
            </div>
            <div>
                <label for="CamDesc">Опис:</label>
                <textarea id="CamDesc" name="FilmDesc"></textarea>
            </div>
        `,
        InstantTable: `
           <div>
                <label for="InstName">Назва:</label>
                <input type="text" id="InstName" name="FilmName" required>
            </div>
            <div>
                <label for="InstPrise">Ціна:</label>
                <input type="number" id="InstPrise" name="FilmPrise" required>
            </div>
            <div>
                <label for="FrontPhotoInst">Фото (URL):</label>
                <input type="text" id="FrontPhotoInst" name="FrontPhoto" required>
            </div>
            <div>
                <label for="BackPhotoInst">Заднє фото (URL):</label>
                <input type="text" id="BackPhotoInst" name="BackPhoto">
            </div>
            <div>
                <label for="InstBrand">Бренд:</label>
                <select id="InstBrand" name="FilmBrand" required>
                    <option value="Fujifilm">Fujifilm</option>
                    <option value="Polaroid">Polaroid</option>
                </select>
            </div>
            <div>
                <label for="InstType">Тип картриджів:</label>
                <select id="InstType" name="FilmType" required>
                    <option value="Mini">Маленькі (Mini)</option>
                    <option value="Square">Середні (Square)</option>
                    <option value="Wide">Широкі (Wide)</option>
                </select>
            </div>
            <div>
                <label for="InstDesc">Опис:</label>
                <textarea id="InstDesc" name="FilmDesc"></textarea>
            </div>
        `
    };

    productTypeSelect.addEventListener('change', function () {
        const selectedType = this.value;
        formFieldsDiv.innerHTML = selectedType ? fieldTemplates[selectedType] : '';
    });
});

