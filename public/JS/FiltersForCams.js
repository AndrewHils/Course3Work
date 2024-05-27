document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sort-select');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const typeCheckboxes = document.querySelectorAll('input[name="type"]');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    const productsContainer = document.getElementById('products-container');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const mainPhoto = document.getElementById('main-photo');
    const thumbnailsContainer = document.querySelector('.thumbnails');
    const productName = document.getElementById('product-name');
    const productDesc = document.getElementById('product-desc');
    const productPrice = document.getElementById('product-price');
    const popupAddToCartBtn = document.getElementById('popup-add-to-cart-btn');

    // Переменные для корзины
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
        mainPhoto.src = product.CamFrontPhoto;
        thumbnailsContainer.innerHTML = `
            <img src="${product.CamFrontPhoto}" alt="Front Photo">
            <img src="${product.CamBackPhoto}" alt="Back Photo">
        `;
        productName.textContent = product.CamName;
        productDesc.textContent = product.CamDesc;
        productPrice.textContent = `${product.CamPrise} ₴`;

        popupAddToCartBtn.setAttribute('data-id', product.idFilmCams);
        popupAddToCartBtn.setAttribute('data-image', product.CamFrontPhoto);
        popupAddToCartBtn.setAttribute('data-name', product.CamName);
        popupAddToCartBtn.setAttribute('data-price', product.CamPrise);

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
        modal.style.display = 'none';
    };

    function addProductCardEventListeners() {
        const productCards = document.querySelectorAll('.prod-card');
        productCards.forEach(card => {
            card.querySelector('img').addEventListener('click', function() {
                const productId = card.getAttribute('data-id');
                fetch(`/api/filmcams/${productId}`)
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

        fetch(`/api/filmcams?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                productsContainer.innerHTML = '';

                data.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.className = 'prod-card';
                    productElement.setAttribute('data-id', product.idFilmCams);
                    productElement.innerHTML = `
                        <img src="${product.CamFrontPhoto}" alt="${product.CamName}">
                        <span class="product-name">${product.CamName}</span>
                        <span class="product-price">${product.CamPrise} ₴</span>
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

    updateProducts();
    renderCartItems();
});
