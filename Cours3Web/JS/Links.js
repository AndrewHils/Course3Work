function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка к началу страницы с плавным эффектом
}
function LinkToShop() {
    // Указываем URL страницы, которую нужно открыть
    const url = "./ShopPage.html";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToMainPage() {
    // Указываем URL страницы, которую нужно открыть
    const url = "./MainPage.html";

    // Перенаправляем на новую страницу
    window.location.href = url;
}

function setupTriangleClickHandlers() {
    // Получите все элементы иконки треугольника
    const triangles = document.querySelectorAll('.triangle-icon');

    // Переберите каждую иконку треугольника и добавьте обработчик события click
    triangles.forEach(triangle => {
        triangle.addEventListener('click', function() {
            // Находите ближайший родительский элемент вопроса
            const question = this.closest('.question');
            // Находите область с ответом внутри этого вопроса
            const answer = question.querySelector('.answer');
            // Переключайте отображение области с ответом
            answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
        });
    });
}

// Вызовите функцию setupTriangleClickHandlers() после загрузки страницы
window.addEventListener('DOMContentLoaded', setupTriangleClickHandlers);

