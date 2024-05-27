// Цей код відповідає за анімацію появи елементів на сторінці при прокручуванні.
// Він перевіряє, чи елементи в зоні видимості екрану, і якщо так, то додає їм клас, який відповідає за анімацію появи.
// При завантаженні сторінки також викликається функція, яка відображає текст поетапно, щоб створити ефект печаті.

document.addEventListener("DOMContentLoaded", function() {
    const paperSection = document.querySelector(".paper-section");
    let showAdded = false;

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            (rect.top >= 0 && rect.top <= window.innerHeight) ||
            (rect.bottom >= 0 && rect.bottom <= window.innerHeight)
        );
    }

    function addShowClass() {
        if (isElementInViewport(paperSection) && !showAdded) {
            paperSection.classList.add("show");
            showAdded = true;
        }
    }

    // Викликати addShowClass() при прокрутці
    window.addEventListener("scroll", addShowClass);

    addShowClass();

    ////////////////////

    const priseSection = document.querySelector(".print-prise-section");
    let showAdded2 = false;

    function addShowClass2() {
        if (isElementInViewport(priseSection) && !showAdded2) {
            priseSection.classList.add("show2");
            showAdded2 = true;
        }
    }

    // Викликати addShowClass2() при прокрутці
    window.addEventListener("scroll", addShowClass2);

    // Викликати addShowClass2() один раз при завантаженні сторінки, якщо елемент вже на екрані
    addShowClass2();

    const text = "Звільніть свою творчість та закарбуйте найкращі миті на папері за допомогою нашого професійного фотодруку та оформлення.\nНаші послуги фотодруку охоплюють усі аспекти, починаючи від друку звичайних фотографій різних розмірів до створення великоформатних фотографій для виставок та презентацій.\nМи використовуємо тільки найсучасніше обладнання та високоякісні матеріали, щоб кожна фотографія виглядала як професійний шедевр.\nУ нас ви також зможете замовити оформлення ваших фотографій у стильні рамки або фоторамки, що додасть їм елегантності та завершеності.\nМи пропонуємо широкий вибір рамок різних стилів та кольорів, щоб ви могли підібрати той, який найкраще пасує вашому смаку та інтер'єру.\nНехай ваші фотографії стануть справжніми шедеврами завдяки професійному фотодруку та оформленню на \"36TH Frame\"!";
    const typingTextElement = document.getElementById("typing-text");
    let index = 0;

    async function typeText() {
        if (index < text.length) {
            if (text.charAt(index) === '\n') {
                typingTextElement.innerHTML += "<p>";
            } else {
                typingTextElement.innerHTML += text.charAt(index);
            }
            index++;
            setTimeout(typeText, 10);
        }
    }

    typeText();
});
