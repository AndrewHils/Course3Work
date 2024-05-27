// Знаходимо кнопку "Відправити"
const sendButton = document.querySelector('.question-btn');

// Знаходимо всі поля введення та текстове поле
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const commentTextarea = document.getElementById('comment');

// Функція для очищення полів форми
function clearForm() {
    nameInput.value = ''; // Очищуємо поле введення імені
    emailInput.value = ''; // Очищуємо поле введення електронної пошти
    phoneInput.value = ''; // Очищуємо поле введення телефону
    commentTextarea.value = ''; // Очищуємо текстове поле коментарів
}

// Додаємо обробник події click на кнопку "Відправити"
sendButton.addEventListener('click', clearForm);

// Создаем функцию, которая будет инициализировать карту
function initMap() {
    // Створюємо об'єкт карти і встановлюємо його центр і рівень масштабування
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.4968308, lng: 30.4342908}, // Тут задаємо координати бажаного місцезнаходження
        zoom: 12
    });

    // Створюємо маркер для місцезнаходження
    var marker = new google.maps.Marker({
        position: {lat: 50.4968308, lng: 30.4342908},
        map: map
    });
}
// Викликаємо функцію при завантаженні сторінки
window.onload = function() {
    // Завантажуємо карту
    initMap();
};
