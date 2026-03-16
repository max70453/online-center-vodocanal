# Backend для Центра теплоснабжения

## Требования

- PHP 7.4 или выше
- MySQL 5.7 или выше
- Apache/Nginx веб-сервер
- PDO PHP расширение
- JSON PHP расширение

## Установка

1. Создайте базу данных MySQL и импортируйте схему:
```bash
mysql -u root -p < schema.sql
```

2. Настройте параметры подключения к базе данных в файле `config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'ваш_пользователь');
define('DB_PASS', 'ваш_пароль');
define('DB_NAME', 'heating_center');
```

3. Убедитесь, что веб-сервер имеет права на запись в директорию `uploads` (если она используется).

4. Настройте URL сайта в `config.php`:
```php
define('SITE_URL', 'http://ваш-домен/путь-к-проекту');
```

## Структура API

### Аутентификация

- `POST /backend/auth.php`
  - Действия: `register`, `login`, `logout`
  - Параметры зависят от действия

### Управление аккаунтом

- `POST /backend/account.php`
  - Действия: `get_balance`, `get_payment_history`, `process_payment`, `generate_receipt`
  - Параметры зависят от действия

### Управление тарифами

- `POST /backend/tariffs.php`
  - Действия: `get_tariffs`, `calculate_cost`, `select_tariff`, `get_current_tariff`
  - Параметры зависят от действия

### Техническая поддержка

- `POST /backend/support.php`
  - Действия: `create_ticket`, `get_tickets`, `get_ticket_details`, `add_response`, `close_ticket`
  - Параметры зависят от действия

## Безопасность

1. Все пароли хешируются с использованием `password_hash()`
2. Используются подготовленные запросы для предотвращения SQL-инъекций
3. Проверка авторизации для защищенных эндпоинтов
4. Валидация входных данных

## Обработка ошибок

Все API эндпоинты возвращают JSON-ответ в формате:
```json
{
    "success": true|false,
    "message": "Сообщение об ошибке или успехе",
    "data": {} // Опциональные данные
}
```

## Примеры использования

### Регистрация пользователя
```javascript
fetch('/backend/auth.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'register',
        full_name: 'Иван Иванов',
        email: 'ivan@example.com',
        password: 'password123',
        account_number: '1234567890'
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Получение баланса
```javascript
fetch('/backend/account.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'get_balance'
    })
})
.then(response => response.json())
.then(data => console.log(data));
``` 