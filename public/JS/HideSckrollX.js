// Цей скрипт забороняє скролл по осі X та виконує додаткові заходи для предотвращення скролла через колесико миші та на сенсорних пристроях.
// Він також налаштовує обробник подій для пересунення вікна при прокручуванні та зміні розміру вікна, щоб забезпечити стале положення.

document.addEventListener('scroll', function() {
    window.scrollTo(0, window.scrollY);
});

window.addEventListener('resize', function() {
    document.body.style.width = window.innerWidth + 'px';
});

// Запрет скролла по оси X с помощью добавления обработчика событий
document.documentElement.style.overflowX = 'hidden'; // CSS fallback

// Для предотвращения скролла через колесико мыши
window.addEventListener('wheel', function(event) {
    if (event.deltaX !== 0) {
        event.preventDefault();
    }
}, { passive: false });

// Для предотвращения скролла на сенсорных устройствах
window.addEventListener('touchmove', function(event) {
    if (event.touches[0].clientX !== event.touches[0].screenX) {
        event.preventDefault();
    }
}, { passive: false });
