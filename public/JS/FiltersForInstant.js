document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sort-select');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    const typeCheckboxes = document.querySelectorAll('input[name="type"]');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');
    const productsContainer = document.getElementById('products-container'); // Контейнер для продуктов

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

        // Отправляем AJAX-запрос
        fetch(`/api/instant?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                // Очищаем контейнер продуктов
                productsContainer.innerHTML = '';

                // Добавляем новые продукты
                data.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.className = 'prod-card';
                    productElement.innerHTML = `
                        <img src="${product.FrontPhotoInst}" alt="${product.InstName}">
                        <span class="product-name">${product.InstName}</span>
                        <span class="product-price">${product.InstPrise} ₴</span>
                        <div class="add-to-cart-btn">Додати у кошик</div>
                    `;
                    productsContainer.appendChild(productElement);
                });
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
});
