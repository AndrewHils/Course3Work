// Серверний код для звязку клієна з БД
// Цей серверний код створює зв'язок між клієнтом та базою даних. Він використовує Express.js для обробки HTTP-запитів, MySQL для взаємодії з базою даних та EJS як двигун шаблонів для генерації HTML-сторінок.
// Після підключення до бази даних, сервер налаштовує різні маршрути для відображення сторінок, отримання та оновлення даних в базі даних.
// Спочатку визначаються статичні теки, які містять CSS та JavaScript файли, а також middleware для обробки JSON-даних та URL-кодування.
// Потім налаштовується з'єднання з базою даних MySQL, з використанням хоста, користувача, пароля та назви бази даних.
// Далі налаштовується двигун шаблонів EJS, щоб рендерити HTML-сторінки на сервері.
// Потім описуються різні маршрути для відображення головної сторінки, сторінки з фільмами, сторінки з камерами та інших сторінок. Запити GET та POST обробляються для відправки та отримання даних з сервера.
// Деякі маршрути також використовуються для AJAX-запитів на фільтрацію та сортування даних без перезавантаження сторінки.
// Також є маршрути для обробки форми замовлення та контактної форми. Передбачається перевірка валідності даних перед їхнім збереженням у базі даних.
// Крім того, є маршрути для аутентифікації адміністратора, оновлення статусу замовлення та видалення замовлення.
// Сервер слухає певний порт (3000 за замовчуванням) для обробки запитів.

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();

// Підключення статичної теки
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // middleware для парсинга JSON

// Налаштування бази даних
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Tisha2003', // пароль пользователя root
    database: 'BDFilmCours',
    port: 3306
});

// Підключення до бази даних
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database');
});

// Налаштування двигуна шаблонів
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Маршрут для головної сторінки
app.get('/', (req, res) => {
    const query = 'SELECT * FROM Film135Table LIMIT 5';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }
        res.render('MainPage', { products: results }); // Передача змінної products у шаблон
    });
});

// Маршрут для сторінки Film135Page
app.get('/film135', (req, res) => {
    const query = 'SELECT * FROM Film135Table';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }
        res.render('Film135Page', { products: results });
    });
});
// Маршрут для AJAX-запитів на фільтрацію і сортування
app.get('/api/film135', (req, res) => {
    const { brand, type, sort } = req.query;

    let query = 'SELECT * FROM Film135Table WHERE 1=1'; // '1=1' дозволяє додати умови з AND
    const filters = [];

    if (brand) {
        filters.push(`FilmBrand IN (${brand.split(',').map(b => db.escape(b)).join(',')})`);
    }

    if (type) {
        filters.push(`FilmType IN (${type.split(',').map(t => db.escape(t)).join(',')})`);
    }

    if (filters.length > 0) {
        query += ' AND ' + filters.join(' AND ');
    }

    if (sort) {
        switch (sort) {
            case 'popular': // Використовуємо id для сортування за популярністю
                query += ' ORDER BY Id DESC';
                break;
            case 'cheaper':
                query += ' ORDER BY FilmPrise ASC';
                break;
            case 'expensive':
                query += ' ORDER BY FilmPrise DESC';
                break;
        }
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results); // Повертаємо дані у форматі JSON
    });
});

app.get('/api/film135/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM Film135Table WHERE Id = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// Маршрут для сторінки FilmCamsPage
app.get('/filmcams', (req, res) => {
    const query = 'SELECT * FROM FilmCams';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }
        res.render('AnalogCamsPage', { products: results });
    });
});
// Новий маршрут для отримання даних про конкретну камеру за ID
app.get('/api/filmcams/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM FilmCams WHERE idFilmCams = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// Маршрут для AJAX-запитів на фільтрацію та сортування камер
app.get('/api/filmcams', (req, res) => {
    const { brand, type, sort } = req.query;

    let query = 'SELECT * FROM FilmCams WHERE 1=1';
    const filters = [];

    if (brand) {
        filters.push(`CamBrand IN (${brand.split(',').map(b => db.escape(b)).join(',')})`);
    }

    if (type) {
        filters.push(`CamType IN (${type.split(',').map(t => db.escape(t)).join(',')})`);
    }

    if (filters.length > 0) {
        query += ' AND ' + filters.join(' AND ');
    }

    if (sort) {
        switch (sort) {
            case 'popular':
                query += ' ORDER BY idFilmCams DESC';
                break;
            case 'cheaper':
                query += ' ORDER BY CamPrise ASC';
                break;
            case 'expensive':
                query += ' ORDER BY CamPrise DESC';
                break;
        }
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Маршрут для сторінки Film120Page
app.get('/film120', (req, res) => {
    const query = 'SELECT * FROM Film120Table';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }
        res.render('Film120Page', { products: results });
    });
});

app.get('/api/film120/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM Film120Table WHERE IdFilm120 = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});
// Маршрут на фільтрацію та сортування
app.get('/api/film120', (req, res) => {
    const { brand, type, sort } = req.query;

    let query = 'SELECT * FROM Film120Table WHERE 1=1'; // '1=1' позволяет добавить условия с AND
    const filters = [];

    if (brand) {
        filters.push(`FilmBrand120 IN (${brand.split(',').map(b => db.escape(b)).join(',')})`);
    }

    if (type) {
        filters.push(`FilmType120 IN (${type.split(',').map(t => db.escape(t)).join(',')})`);
    }

    if (filters.length > 0) {
        query += ' AND ' + filters.join(' AND ');
    }

    if (sort) {
        switch (sort) {
            case 'popular':
                query += ' ORDER BY IdFilm120 DESC';
                break;
            case 'cheaper':
                query += ' ORDER BY FilmPrise120 ASC';
                break;
            case 'expensive':
                query += ' ORDER BY FilmPrise120 DESC';
                break;
        }
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// InstantPage
app.get('/instant', (req, res) => {
    const query = 'SELECT * FROM InstantTable';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).send('Error fetching data');
            return;
        }
        res.render('InstantPage', { products: results }); // Передача переменной products в шаблон
    });
});

app.get('/api/instant', (req, res) => {
    const { brand, type, sort } = req.query;

    let query = 'SELECT * FROM InstantTable WHERE 1=1'; // '1=1' позволяет добавить условия с AND
    const filters = [];

    if (brand) {
        filters.push(`InstBrand IN (${brand.split(',').map(b => db.escape(b)).join(',')})`);
    }

    if (type) {
        filters.push(`InstType IN (${type.split(',').map(t => db.escape(t)).join(',')})`);
    }

    if (filters.length > 0) {
        query += ' AND ' + filters.join(' AND ');
    }

    if (sort) {
        switch (sort) {
            case 'popular':
                query += ' ORDER BY IdInst DESC';
                break;
            case 'cheaper':
                query += ' ORDER BY InstPrise ASC';
                break;
            case 'expensive':
                query += ' ORDER BY InstPrise DESC';
                break;
        }
    }

    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

//Сторінка оформлення замовлення
app.get('/checkout', (req, res) => {
    res.render('CheckoutPage');
});
// Маршрут для обработки отправки заказа
app.post('/submit-order',
    [
        body('name').notEmpty().withMessage("Ім'я є обов'язковим"),
        body('email').isEmail().withMessage('Введіть дійсний email'),
        body('phone').notEmpty().withMessage('Телефон є обов\'язковим'),
        body('address').notEmpty().withMessage('Адреса є обов\'язковою')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, address, cart } = req.body;

        const query = 'INSERT INTO orders (name, email, phone, address, cart, status) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [name, email, phone, address, JSON.stringify(cart), 'Pending'], (err, result) => {
            if (err) {
                console.error('Database error:', err); // Логування помилок
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.json({ success: true });
        });
    }
);

// Маршрут для обробки контактної форми
app.post('/submit-contact',
    [
        body('name').notEmpty().withMessage("Ім'я є обов'язковим"),
        body('email').isEmail().withMessage('Введіть дійсний email'),
        body('phone').notEmpty().withMessage('Телефон є обов\'язковим'),
        body('comment').notEmpty().withMessage('Повідомлення є обов\'язковим')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, comment } = req.body;

        const query = 'INSERT INTO orders (name, email, phone, note) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, phone, comment], (err, result) => {
            if (err) {
                console.error('Database error:', err); // Логирование ошибки
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            res.json({ success: true });
        });
    }
);

//Сорінка логін для admin
app.post('/admin_login', (req, res) => {
    const { login, password } = req.body;

    const query = 'SELECT * FROM admins WHERE admin_login = ? AND admin_password = ?';
    db.query(query, [login, password], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

app.get('/admin_page', (req, res) => {
    const query = 'SELECT id, name, phone, email, address, cart, status, created_at, note FROM `orders`';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        const orders = results.filter(order => order.cart !== null);
        const questions = results.filter(order => order.note !== null);

        console.log('Orders:', orders);
        console.log('Questions:', questions);

        res.render('AdminPage', { orders, questions });
    });
});

// Маршрут для оновлення статусу замовлення
app.post('/update_order_status/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, results) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true });
    });
});

// Маршрут для видалення замовлення
app.delete('/delete_order/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM orders WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting order:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true });
    });
});

app.post('/admin/add_product', [
    body('productType').notEmpty().withMessage('Тип товару є обов\'язковим'),
    body('FilmName').notEmpty().withMessage('Назва є обов\'язковою'),
    body('FilmPrise').isNumeric().withMessage('Ціна має бути числом'),
    body('FrontPhoto').notEmpty().withMessage('Фото є обов\'язковим'),
    body('FilmBrand').notEmpty().withMessage('Бренд є обов\'язковим'),
    body('FilmType').notEmpty().withMessage('Тип є обов\'язковим'),
    body('FilmISO').notEmpty().withMessage('ISO є обов\'язковим')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { productType, FilmName, FilmPrise, FrontPhoto, BackPhoto, FilmBrand, FilmType, FilmISO, FilmDesc } = req.body;

    let query;
    let params;

    switch (productType) {
        case 'Film135Table':
            query = 'INSERT INTO Film135Table (FilmName, FilmPrise, FrontPhoto, BackPhoto, FilmBrand, FilmType, FilmISO, FilmDesc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            params = [FilmName, FilmPrise, FrontPhoto, BackPhoto, FilmBrand, FilmType, FilmISO, FilmDesc];
            break;
        case 'Film120Table':
            query = 'INSERT INTO Film120Table (FilmName120, FilmPrise120, FrontPhoto120, BackPhoto120, FilmBrand120, FilmType120, FilmISO120, FilmDesc120) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            params = [FilmName, FilmPrise, FrontPhoto, BackPhoto, FilmBrand, FilmType, FilmISO, FilmDesc];
            break;
        case 'FilmCams':
            query = 'INSERT INTO FilmCams (CamName, CamPrise, CamFrontPhoto, CamBackPhoto, CamBrand, CamType, CamDesc) VALUES (?, ?, ?, ?, ?, ?, ?)';
            params = [FilmName, FilmPrise, FrontPhoto, BackPhoto, FilmBrand, FilmType, FilmDesc];
            break;
        case 'InstantTable':
            query = 'INSERT INTO InstantTable (InstName, InstPrise, FrontPhotoInst, BackPhotoInst, InstBrand, InstType, InstDesc) VALUES (?, ?, ?, ?, ?, ?, ?)';
            params = [FilmName, FilmPrise, FrontPhoto, BackPhoto, FilmBrand, FilmType, FilmDesc];
            break;
        default:
            return res.status(400).json({ success: false, message: 'Невідомий тип товару' });
    }

    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.redirect('/admin_page'); // Перенаправлення на адмін сторінку після успішного додавання
    });
});


//Завантаження БД
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
