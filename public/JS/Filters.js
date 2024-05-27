// Цей скрипт відповідає за функціонал керування товарами на сторінці, включаючи відображення деталей товару у модальному вікні,
// додавання товарів до кошика, фільтрацію товарів за брендом та типом, сортування товарів за популярністю, а також відображення
// вмісту кошика та підрахунок загальної вартості товарів у кошику для сторінки Film135Page.ejs.
document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products-container');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const mainPhoto = document.getElementById('main-photo');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const productName = document.getElementById('product-name');
    const productDesc = document.getElementById('product-desc');
    const productPrice = document.getElementById('product-price');
    const productType = document.getElementById('product-type');
    const productISO = document.getElementById('product-iso');
    const productBrand = document.getElementById('product-brand');
    const popupAddToCartBtn = document.getElementById('popup-add-to-cart-btn');
    const sortSelect = document.getElementById('sort-select');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const typeCheckboxes = document.querySelectorAll('input[name="type"]');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');

    // Добавленные переменные для корзины
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    function renderCartItems() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
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

    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }

    function updateCartTotal() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = `${total} ₴`;
    }

    function addRemoveItemListeners() {
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(event) {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const index = parseInt(event.target.getAttribute('data-index'), 10);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
            });
        });
    }

    function openModal(product) {
        mainPhoto.src = product.FrontPhoto;
        thumbnailsContainer.innerHTML = `
            <img src="${product.FrontPhoto}" alt="Front Photo">
            <img src="${product.BackPhoto}" alt="Back Photo">
        `;
        productName.textContent = product.FilmName;
        productDesc.textContent = product.FilmDesc;
        productPrice.textContent = `Вартість плівки: ${product.FilmPrise} ₴`;
        productType.textContent = `Тип плівки: ${product.FilmType}`;
        productISO.textContent = `ISO: ${product.FilmISO}`;
        productBrand.textContent = `Бренд: ${product.FilmBrand}`;

        popupAddToCartBtn.setAttribute('data-id', product.Id);
        popupAddToCartBtn.setAttribute('data-image', product.FrontPhoto);
        popupAddToCartBtn.setAttribute('data-name', product.FilmName);
        popupAddToCartBtn.setAttribute('data-price', product.FilmPrise);
        modal.style.display = 'block';
    }

    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    popupAddToCartBtn.onclick = function() {
        const product = {
            id: popupAddToCartBtn.getAttribute('data-id'),
            image: popupAddToCartBtn.getAttribute('data-image'),
            name: popupAddToCartBtn.getAttribute('data-name'),
            price: parseFloat(popupAddToCartBtn.getAttribute('data-price'))
        };
        addToCart(product);
        modal.style.display = 'none'; // Закрыть поп-ап после добавления в корзину
    };

    function addProductCardEventListeners() {
        const productCards = document.querySelectorAll('.prod-card');
        productCards.forEach(card => {
            card.querySelector('img').addEventListener('click', function() {
                const productId = card.getAttribute('data-id');
                fetch(`/api/film135/${productId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Product not found');
                        }
                        return response.json();
                    })
                    .then(product => openModal(product))
                    .catch(error => {
                        console.error('Error fetching product data:', error);
                        alert('Product not found');
                    });
            });

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

    function getSelectedValues(checkboxes) {
        return Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
    }

    function updateProducts() {
        const brands = getSelectedValues(brandCheckboxes);
        const types = getSelectedValues(typeCheckboxes);
        const sort = sortSelect.value;

        const params = new URLSearchParams();

        if (brands.length > 0) {
            params.append('brand', brands.join(','));
        }

        if (types.length > 0) {
            params.append('type', types.join(','));
        }

        if (sort) {
            params.append('sort', sort);
        }

        fetch(`/api/film135?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                productsContainer.innerHTML = '';

                data.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.className = 'prod-card';
                    productElement.setAttribute('data-id', product.Id);
                    productElement.innerHTML = `
                        <img src="${product.FrontPhoto}" alt="${product.FilmName}">
                        <span class="product-name">${product.FilmName} тип-135</span>
                        <span class="product-price">${product.FilmPrise} ₴</span>
                        <div class="add-to-cart-btn">Додати у кошик</div>
                    `;
                    productsContainer.appendChild(productElement);
                });

                addProductCardEventListeners();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    sortSelect.addEventListener('change', updateProducts);
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProducts);
    });
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProducts);
    });

    clearFiltersBtn.addEventListener('click', () => {
        brandCheckboxes.forEach(checkbox => checkbox.checked = false);
        typeCheckboxes.forEach(checkbox => checkbox.checked = false);
        sortSelect.value = 'popular';
        updateProducts();
    });

    addProductCardEventListeners();
    updateProducts();
});
