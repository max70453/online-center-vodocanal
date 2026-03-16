// Данные о тарифах
const tariffs = [
    {
        id: 1,
        name: 'Базовый',
        category: 'residential',
        price: '350 ₽/месяц',
        features: [
            'Холодное водоснабжение',
            'Водоотведение',
            'Базовая поддержка'
        ],
        description: 'Оптимальное решение для жилых помещений с 1-2 проживающими'
    },
    {
        id: 2,
        name: 'Стандарт',
        category: 'residential',
        price: '550 ₽/месяц',
        features: [
            'Холодное водоснабжение',
            'Горячее водоснабжение',
            'Водоотведение',
            'Приоритетная поддержка'
        ],
        description: 'Идеальный выбор для семьи из 3-4 человек'
    },
    {
        id: 3,
        name: 'Бизнес',
        category: 'commercial',
        price: '2500 ₽/месяц',
        features: [
            'Холодное водоснабжение',
            'Горячее водоснабжение',
            'Водоотведение',
            'Приоритетное обслуживание',
            'Аварийная поддержка'
        ],
        description: 'Комплексное решение для коммерческих помещений'
    }
];

// Функция для отображения тарифов
function displayTariffs(category = 'all') {
    const tariffGrid = document.querySelector('.tariffs-grid');
    if (!tariffGrid) {
        console.error('Не найден элемент для отображения тарифов');
        return;
    }

    const template = document.getElementById('tariffTemplate');
    if (!template) {
        console.error('Не найден шаблон тарифа');
        tariffGrid.innerHTML = '<p class="error-message">Ошибка загрузки тарифов</p>';
        return;
    }
    
    // Очищаем текущие тарифы
    tariffGrid.innerHTML = '';
    
    // Фильтруем тарифы по категории
    const filteredTariffs = category === 'all' 
        ? tariffs 
        : tariffs.filter(tariff => tariff.category === category);
    
    // Добавляем отфильтрованные тарифы
    filteredTariffs.forEach(tariff => {
        const tariffCard = template.content.cloneNode(true);
        
        tariffCard.querySelector('.tariff-name').textContent = tariff.name;
        tariffCard.querySelector('.tariff-price').textContent = tariff.price;
        
        const featuresList = tariffCard.querySelector('.tariff-features');
        tariff.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        tariffCard.querySelector('.tariff-description').textContent = tariff.description;
        
        const selectButton = tariffCard.querySelector('.select-tariff-btn');
        selectButton.addEventListener('click', () => selectTariff(tariff));
        
        tariffGrid.appendChild(tariffCard);
    });
}

// Функция выбора тарифа
function selectTariff(tariff) {
    // Проверяем авторизацию
    if (!window.isAuthenticated) {
        document.getElementById('authForm').classList.remove('hidden');
        return;
    }
    
    // Здесь будет логика обработки выбора тарифа
    alert(`Вы выбрали тариф "${tariff.name}". Наш менеджер свяжется с вами для оформления.`);
}

// Базовые тарифы для разных типов потребителей (руб/человека в месяц)
const BASE_RATES = {
    residential: 150,
    commercial: 350,
    industrial: 500,
    all: 150
};

// Коэффициенты для разных типов водоснабжения
const HEATING_COEFFICIENTS = {
    cold: 1.0,
    hot: 1.5
};

// Функция расчета стоимости
function calculateCost() {
    const squareMetersInput = document.getElementById('squareMeters');
    const heatingTypeSelect = document.getElementById('heatingType');
    const tariffCategorySelect = document.getElementById('tariffCategory');
    const resultDiv = document.getElementById('calculationResult');
    
    if (!squareMetersInput || !heatingTypeSelect || !tariffCategorySelect || !resultDiv) {
        console.error('Не найдены необходимые элементы формы');
        return;
    }

    const residents = parseFloat(squareMetersInput.value);
    const waterType = heatingTypeSelect.value;
    
    if (!residents || isNaN(residents) || residents <= 0) {
        resultDiv.innerHTML = '<p class="error-message">Пожалуйста, введите корректное количество проживающих</p>';
        return;
    }
    
    // Получаем выбранную категорию тарифа
    const selectedCategory = document.getElementById('tariffCategory').value;
    const baseRate = BASE_RATES[selectedCategory];
    
    // Расчет стоимости с учетом коэффициентов
    const waterCoefficient = HEATING_COEFFICIENTS[waterType];
    const totalCost = baseRate * residents * waterCoefficient;
    
    // Анимация появления результата
    resultDiv.style.opacity = '0';
    resultDiv.innerHTML = `
        <div class="cost-breakdown">
            <h4>Расчет стоимости:</h4>
            <p>Количество проживающих: ${residents} чел.</p>
            <p>Тип потребителя: ${getPropertyTypeText(selectedCategory)}</p>
            <p>Тип водоснабжения: ${waterType === 'cold' ? 'Холодное (ХВС)' : 'Горячее (ГВС)'}</p>
            <p>Базовый тариф: ${baseRate} ₽/чел.</p>
            <p>Коэффициент типа водоснабжения: ${waterCoefficient}</p>
            <p class="total-cost">Итоговая стоимость: ${totalCost.toLocaleString('ru-RU')} ₽/месяц</p>
        </div>
    `;
    
    // Плавное появление результата
    setTimeout(() => {
        resultDiv.style.transition = 'opacity 0.3s ease-in-out';
        resultDiv.style.opacity = '1';
        resultDiv.classList.add('active');
    }, 50);
}

// Функция для получения текстового описания типа помещения
function getPropertyTypeText(category) {
    const types = {
        residential: 'Жилое помещение',
        commercial: 'Коммерческое помещение',
        industrial: 'Промышленный объект',
        all: 'Жилое помещение'
    };
    return types[category];

}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Отображаем все тарифы при загрузке
    displayTariffs();
    
    // Обработчик фильтра категорий
    document.getElementById('tariffCategory').addEventListener('change', (e) => {
        displayTariffs(e.target.value);
    });
    
    // Обработчик кнопки расчета стоимости
    document.getElementById('calculateCost').addEventListener('click', calculateCost);
});