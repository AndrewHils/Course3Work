//Цей скрипт зберігає функції для переміщення по Сайту, а також додає функціональність деяким елементам
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка к началу страницы с плавным эффектом
}
function toggleMenu() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
}
function LinkToShop() {
    // Указываем URL страницы, которую нужно открыть
    const url = "./ShopPage.html";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToContacts() {
    // Указываем URL страницы, которую нужно открыть
    const url = "./ContactsPage.html";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToPrint() {
    // Указываем URL страницы, которую нужно открыть
    const url = "./PrintPage.html";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToAnalogCams() {
    // Указываем URL страницы, которую нужно открыть
    const url = "/filmcams";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkTo135Film() {
    // Указываем URL страницы, которую нужно открыть
    const url = "/film135";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkTo120Film() {
    // Указываем URL страницы, которую нужно открыть
    const url = "/film120";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToInstant() {
    // Указываем URL страницы, которую нужно открыть
    const url = "/instant";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToPrintToOrder() {
    // Указываем URL страницы, которую нужно открыть
    const url = "./ContactsPage.html#print-order";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToChekOut() {
    // Указываем URL страницы, которую нужно открыть
    const url = "/checkout";

    // Перенаправляем на новую страницу
    window.location.href = url;
}
function LinkToMainPage() {
    // Указываем URL страницы, которую нужно открыть
    const url = "/";

    // Перенаправляем на новую страницу
    window.location.href = url;
}


function setupTriangleClickHandlers() {
    const triangles = document.querySelectorAll('.triangle-icon');
    triangles.forEach(triangle => {
        triangle.addEventListener('click', function() {
            const answer = this.parentElement.querySelector('.answer');
            if (answer.style.display === 'none') {
                answer.style.display = 'block';
                this.classList.add('active');
            } else {
                answer.style.display = 'none';
                this.classList.remove('active');
            }
        });
    });
}


