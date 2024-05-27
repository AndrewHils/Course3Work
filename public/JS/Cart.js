document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon'); // Отримує значення іконки кошика
    const cartCount = document.querySelector('.cart-count'); // Отримує значення лічильника товарів у кошику
    const cartModal = document.getElementById('cart-modal'); // Отримує модальне вікно кошика
    const closeCartBtn = document.querySelector('.close-cart'); // Отримує кнопку закриття модального вікна
    const cartItemsContainer = document.querySelector('.cart-items'); // Отримує контейнер для відображення товарів у кошику
    const totalPriceElement = document.querySelector('.total-price'); // Отримує елемент для відображення загальної вартості товарів у кошику


    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Отримує дані кошика з локального сховища

    // Функція оновлення лічильника товарів у кошику
    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Функція оновлення загальної вартості товарів у кошику
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = `${total} ₴`;
    }

    // Функція рендерингу товарів у кошику
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <span>${item.price} ₴</span>
                <button class="remove-btn" data-index="${index}">Видалити</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        updateCartCount();
        updateCartTotal();
        addRemoveItemListeners();
    }

    // Функція додавання обробників подій для кнопок видалення товару з кошика
    function addRemoveItemListeners() {
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                const index = parseInt(event.target.getAttribute('data-index'), 10);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
            });
        });
    }

    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    // Функція відкриття модального вікна кошика
    function openCartModal() {
        cartModal.style.display = 'block';
    }

    function closeCartModal() {
        cartModal.style.display = 'none';
    }

    cartIcon.addEventListener('click', openCartModal);
    closeCartBtn.addEventListener('click', closeCartModal);

    window.onclick = function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    };

    // Додає обробник подій для кнопок "Додати до кошика" на карточках товарів
    function addProductEventListeners() {
        const productCards = document.querySelectorAll('.prod-card');
        productCards.forEach(card => {
            card.querySelector('.add-to-cart-btn').addEventListener('click', function(event) {
                event.stopPropagation();
                const product = {
                    id: card.getAttribute('data-id'),
                    image: card.querySelector('img').src,
                    name: card.querySelector('.product-name').textContent,
                    price: parseFloat(card.querySelector('.product-price').textContent)
                };
                addToCart(product);
            });
        });
    }

    // Викликає функцію рендерингу товарів у кошику при завантаженні сторінки
    renderCartItems();
    // Викликає функцію "Додати до кошика"
    addProductEventListeners();
});
