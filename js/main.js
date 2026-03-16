// Глобальные переменные для хранения состояния приложения
let isAuthenticated = false;
let userData = null;

// Обработчики событий для кнопок авторизации
document.getElementById('loginBtn').addEventListener('click', () => {
    document.getElementById('authForm').classList.remove('hidden');
});

document.getElementById('registerBtn').addEventListener('click', () => {
    document.getElementById('registerForm').classList.remove('hidden');
});

// Закрытие модальных окон при клике вне их области
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Обработка формы авторизации
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    // Здесь будет логика авторизации через API
    // Временная имитация успешной авторизации
    simulateAuth(email);
});

// Обработка формы регистрации
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const accountNumber = form.querySelector('input[placeholder="Номер лицевого счета"]').value;

    // Здесь будет логика регистрации через API
    // Временная имитация успешной регистрации
    simulateAuth(email);
});

// Имитация авторизации (временное решение)
function simulateAuth(email) {
    isAuthenticated = true;
    userData = {
        email: email,
        name: 'Иван Иванов',
        accountNumber: '1234567890',
        balance: 5000,
        payments: [
            { date: '2025-01-15', amount: 2000, description: 'Оплата за водоснабжение' },
            { date: '2025-02-15', amount: 2000, description: 'Оплата за водоснабжение' }
        ]
    };

    updateUIAfterAuth();
}

// Обновление интерфейса после авторизации
function updateUIAfterAuth() {
    // Скрываем модальные окна
    document.getElementById('authForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');

    // Обновляем кнопки авторизации
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <span>Здравствуйте, ${userData.name}</span>
        <button id="logoutBtn">Выйти</button>
    `;

    // Показываем личный кабинет
    document.getElementById('account').classList.remove('hidden');

    // Заполняем информацию в личном кабинете
    updateAccountInfo();

    // Добавляем обработчик для выхода
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Обновление информации в личном кабинете
function updateAccountInfo() {
    // Баланс лицевого счета
    document.getElementById('accountBalance').innerHTML = `
        <p>Текущий баланс: ${userData.balance} ₽</p>
        <p>Лицевой счет: ${userData.accountNumber}</p>
    `;

    // История платежей
    const paymentHistory = document.getElementById('paymentHistory');
    paymentHistory.innerHTML = userData.payments.map(payment => `
        <div class="payment-item">
            <p>Дата: ${payment.date}</p>
            <p>Сумма: ${payment.amount} ₽</p>
            <p>Описание: ${payment.description}</p>
        </div>
    `).join('');
}

// Функция выхода из аккаунта
function logout() {
    isAuthenticated = false;
    userData = null;

    // Возвращаем кнопки авторизации
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <button id="loginBtn">Войти</button>
        <button id="registerBtn">Регистрация</button>
    `;

    // Скрываем личный кабинет
    document.getElementById('account').classList.add('hidden');

    // Восстанавливаем обработчики событий
    document.getElementById('loginBtn').addEventListener('click', () => {
        document.getElementById('authForm').classList.remove('hidden');
    });

    document.getElementById('registerBtn').addEventListener('click', () => {
        document.getElementById('registerForm').classList.remove('hidden');
    });
}

// Загрузка тарифов
// Функционал тарифов перенесен в tariffs.js

// Загрузка справочной информации
function loadInfo() {
    const heatCarrierInfo = document.getElementById('heatCarrierInfo');
    heatCarrierInfo.innerHTML = `
        <ul>
            <li>Тип воды: питьевая</li>
            <li>Жесткость: 7-10 мг-экв/л</li>
            <li>Давление в сети: 2-6 бар</li>
            <li>pH воды: 6.5-8.5</li>
        </ul>
    `;

    const technicalInfo = document.getElementById('technicalInfo');
    technicalInfo.innerHTML = `
        <ul>
            <li>Тип системы: централизованное водоснабжение</li>
            <li>Схема подключения: тупиковая</li>
            <li>Расход воды: 200-250 л/чел. в сутки</li>
            <li>Нормативные потери: 3-5%</li>
        </ul>
    `;
}

// Обработка формы заявки
document.getElementById('requestForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const requestType = form.querySelector('#requestType').value;
    const description = form.querySelector('textarea').value;

    // Здесь будет отправка заявки на сервер
    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    form.reset();
});

// Инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    loadTariffs();
    loadInfo();
});