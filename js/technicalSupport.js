// Тестовые данные для приборов учета
const metersData = [
    {
        id: 'M001',
        location: 'ул. Ленина, 15',
        currentReading: '45.7',
        lastUpdate: '2025-01-15 14:30',
        status: 'active',
        type: 'Теплосчётчик'
    },
    {
        id: 'M002',
        location: 'пр. Мира, 78',
        currentReading: '32.4',
        lastUpdate: '2025-01-15 13:45',
        status: 'warning',
        type: 'Расходомер'
    },
    {
        id: 'M003',
        location: 'ул. Гагарина, 23',
        currentReading: '28.9',
        lastUpdate: '2025-01-15 15:00',
        status: 'inactive',
        type: 'Теплосчётчик'
    }
];

// Функция для отображения данных приборов учета
function displayMetersData() {
    const metersContainer = document.getElementById('metersData');
    if (!metersContainer) return;

    metersContainer.innerHTML = '';

    metersData.forEach(meter => {
        const statusClass = `status-${meter.status}`;
        const meterCard = document.createElement('div');
        meterCard.className = `meter-card ${statusClass}`;
        
        meterCard.innerHTML = `
            <div class="meter-header">
                <h4>${meter.type} ${meter.id}</h4>
                <span class="meter-status ${statusClass}"></span>
            </div>
            <div class="meter-info">
                <p><strong>Расположение:</strong> ${meter.location}</p>
                <p><strong>Текущие показания:</strong> ${meter.currentReading} Гкал</p>
                <p><strong>Последнее обновление:</strong> ${meter.lastUpdate}</p>
            </div>
        `;

        metersContainer.appendChild(meterCard);
    });
}

// Данные об аварийных ситуациях
const emergencies = [
    {
        coordinates: [48.015884, 37.802850],
        type: 'Прорыв трубопровода',
        address: 'ул. Ленина, 45',
        time: '15.12.2023 14:30',
        status: 'В работе'
    },
    {
        coordinates: [48.020000, 37.810000],
        type: 'Отсутствие воды',
        address: 'ул. Гагарина, 12',
        time: '15.12.2023 13:15',
        status: 'Новое'
    },
    {
        coordinates: [48.010000, 37.795000],
        type: 'Низкое давление',
        address: 'пр. Мира, 78',
        time: '15.12.2023 10:45',
        status: 'Устранено'
    }
];

// Данные о состоянии оборудования
const equipmentData = [
    {
        name: 'Водонапорная башня',
        details: 'Последняя проверка: 15.01.2025',
        status: 'normal'
    },
    {
        name: 'Насосная станция',
        details: 'Требуется плановое обслуживание',
        status: 'warning'
    },
    {
        name: 'Водомерный узел',
        details: 'В работе с 10.01.2025',
        status: 'normal'
    }
];

// Данные о состоянии коммуникационных линий
const communicationData = [
    {
        name: 'Магистральная линия №1',
        details: 'Рабочее давление в норме',
        status: 'normal'
    },
    {
        name: 'Распределительная сеть',
        details: 'Обнаружена утечка',
        status: 'error'
    },
    {
        name: 'Резервная линия',
        details: 'Готова к работе',
        status: 'normal'
    }
];

// Функция для отображения состояния оборудования
function displayEquipmentStatus() {
    const container = document.getElementById('equipmentStatus');
    if (!container) return;

    container.innerHTML = equipmentData.map(item => `
        <div class="status-item">
            <div class="status-info">
                <div class="status-name">${item.name}</div>
                <div class="status-details">${item.details}</div>
            </div>
            <div class="status-indicator status-${item.status}"></div>
        </div>
    `).join('');
}

// Функция для отображения состояния коммуникационных линий
function displayCommunicationStatus() {
    const container = document.getElementById('communicationStatus');
    if (!container) return;

    container.innerHTML = communicationData.map(item => `
        <div class="status-item">
            <div class="status-info">
                <div class="status-name">${item.name}</div>
                <div class="status-details">${item.details}</div>
            </div>
            <div class="status-indicator status-${item.status}"></div>
        </div>
    `).join('');
}

// Инициализация карты Яндекс.Карт
function initEmergencyMap() {
    // Добавляем скрипт Яндекс.Карт
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU';
    script.onload = function() {
        ymaps.ready(createMap);
    };
    document.head.appendChild(script);
}

// Создание карты и добавление меток
function createMap() {
    const map = new ymaps.Map('emergencyMap', {
        center: [48.015884, 37.802850],
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
    });

    emergencies.forEach(emergency => {
        const marker = new ymaps.Placemark(emergency.coordinates, {
            balloonContent: `
                <div class="emergency-balloon">
                    <h3>${emergency.type}</h3>
                    <p>Адрес: ${emergency.address}</p>
                    <p>Время: ${emergency.time}</p>
                    <p>Статус: ${emergency.status}</p>
                </div>
            `
        }, {
            preset: getPresetByStatus(emergency.status)
        });

        map.geoObjects.add(marker);
    });
}

// Определение стиля метки в зависимости от статуса
function getPresetByStatus(status) {
    switch(status) {
        case 'Новое':
            return 'islands#redDotIcon';
        case 'В работе':
            return 'islands#orangeDotIcon';
        case 'Устранено':
            return 'islands#greenDotIcon';
        default:
            return 'islands#blueDotIcon';
    }
}

// Тестовые данные для заявок
const requestsData = [
    {
        id: 1,
        date: '2025-01-10',
        type: 'emergency',
        typeName: 'Аварийная',
        address: 'ул. Ленина, 45',
        status: 'in-progress',
        statusName: 'В работе',
        team: 'team1',
        teamName: 'Техслужба №1',
        description: 'Прорыв трубопровода на участке между домами 45 и 47. Требуется срочный ремонт.',
        contactName: 'Иванов И.И.',
        contactPhone: '+7 (900) 123-45-67',
        priority: 'high',
        createdBy: 'Диспетчер',
        comments: [
            { date: '2025-01-10 10:30', author: 'Диспетчер', text: 'Заявка создана на основании звонка жильца.' },
            { date: '2025-01-10 11:15', author: 'Техслужба №1', text: 'Выехали на место.' }
        ]
    },
    {
        id: 2,
        date: '2025-01-12',
        type: 'maintenance',
        typeName: 'Плановые работы',
        address: 'пр. Мира, 78',
        status: 'new',
        statusName: 'Новая',
        team: '',
        teamName: 'Не назначена',
        description: 'Плановая проверка и обслуживание водомерного узла.',
        contactName: 'Петров П.П.',
        contactPhone: '+7 (900) 987-65-43',
        priority: 'medium',
        createdBy: 'Инженер',
        comments: [
            { date: '2025-01-12 09:00', author: 'Инженер', text: 'Заявка создана согласно графику плановых работ.' }
        ]
    },
    {
        id: 3,
        date: '2025-01-08',
        type: 'connection',
        typeName: 'Подключение',
        address: 'ул. Гагарина, 12',
        status: 'resolved',
        statusName: 'Выполнена',
        team: 'team2',
        teamName: 'Техслужба №2',
        description: 'Подключение нового абонента к системе водоснабжения.',
        contactName: 'Сидоров С.С.',
        contactPhone: '+7 (900) 111-22-33',
        priority: 'low',
        createdBy: 'Менеджер',
        comments: [
            { date: '2025-01-08 14:00', author: 'Менеджер', text: 'Заявка создана на основании договора №123.' },
            { date: '2025-01-09 10:30', author: 'Техслужба №2', text: 'Работы по подключению выполнены.' },
            { date: '2025-01-09 15:45', author: 'Инженер', text: 'Проверка выполнена. Подключение успешно.' }
        ]
    },
    {
        id: 4,
        date: '2025-01-15',
        type: 'consultation',
        typeName: 'Консультация',
        address: 'ул. Строителей, 5',
        status: 'cancelled',
        statusName: 'Отменена',
        team: '',
        teamName: 'Не назначена',
        description: 'Консультация по вопросам оплаты и тарифам.',
        contactName: 'Кузнецова А.В.',
        contactPhone: '+7 (900) 444-55-66',
        priority: 'low',
        createdBy: 'Оператор',
        comments: [
            { date: '2025-01-15 11:20', author: 'Оператор', text: 'Заявка создана на основании обращения абонента.' },
            { date: '2025-01-15 12:30', author: 'Оператор', text: 'Абонент отменил заявку. Вопрос решен по телефону.' }
        ]
    },
    {
        id: 5,
        date: '2025-01-16',
        type: 'emergency',
        typeName: 'Аварийная',
        address: 'ул. Пушкина, 22',
        status: 'new',
        statusName: 'Новая',
        team: '',
        teamName: 'Не назначена',
        description: 'Отсутствие воды в квартирах с 1 по 36.',
        contactName: 'Николаев Н.Н.',
        contactPhone: '+7 (900) 777-88-99',
        priority: 'high',
        createdBy: 'Диспетчер',
        comments: [
            { date: '2025-01-16 08:15', author: 'Диспетчер', text: 'Заявка создана на основании множественных звонков жильцов.' }
        ]
    }
];

// Функция для отображения заявок в таблице
function displayRequests(requests = requestsData) {
    const tableBody = document.querySelector('#requestsTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (requests.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="no-data">Нет данных для отображения</td>';
        tableBody.appendChild(row);
        return;
    }

    requests.forEach(request => {
        const row = document.createElement('tr');
        row.dataset.requestId = request.id;
        
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${formatDate(request.date)}</td>
            <td>${request.typeName}</td>
            <td>${request.address}</td>
            <td><span class="status-badge status-${request.status}">${request.statusName}</span></td>
            <td>${request.teamName}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-button view-button" data-action="view" data-id="${request.id}">Подробно</button>
                    <button class="action-button status-button" data-action="status" data-id="${request.id}">Статус</button>
                    <button class="action-button team-button" data-action="team" data-id="${request.id}">Техслужба</button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Добавляем обработчики событий для кнопок действий
    addActionButtonsEventListeners();
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Добавление обработчиков событий для кнопок действий
function addActionButtonsEventListeners() {
    const actionButtons = document.querySelectorAll('.action-button');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.dataset.action;
            const requestId = parseInt(this.dataset.id);
            const request = requestsData.find(req => req.id === requestId);
            
            if (!request) return;
            
            switch(action) {
                case 'view':
                    showRequestDetails(request);
                    break;
                case 'status':
                    showChangeStatusModal(request);
                    break;
                case 'team':
                    showAssignTeamModal(request);
                    break;
            }
        });
    });
}

// Отображение подробной информации о заявке
function showRequestDetails(request) {
    const detailsContainer = document.getElementById('requestDetails');
    const modal = document.getElementById('requestDetailsModal');
    
    if (!detailsContainer || !modal) return;
    
    detailsContainer.innerHTML = `
        <div class="detail-group">
            <div class="detail-label">Номер заявки:</div>
            <div class="detail-value">${request.id}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Дата создания:</div>
            <div class="detail-value">${formatDate(request.date)}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Тип заявки:</div>
            <div class="detail-value">${request.typeName}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Адрес:</div>
            <div class="detail-value">${request.address}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Статус:</div>
            <div class="detail-value"><span class="status-badge status-${request.status}">${request.statusName}</span></div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Бригада:</div>
            <div class="detail-value">${request.teamName}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Описание:</div>
            <div class="detail-value">${request.description}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Контактное лицо:</div>
            <div class="detail-value">${request.contactName}, ${request.contactPhone}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Приоритет:</div>
            <div class="detail-value">${getPriorityName(request.priority)}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">Создана:</div>
            <div class="detail-value">${request.createdBy}</div>
        </div>
        <div class="detail-group">
            <div class="detail-label">История:</div>
            <div class="detail-value comments-history">
                ${request.comments.map(comment => `
                    <div class="comment">
                        <div class="comment-header">
                            <span class="comment-date">${comment.date}</span>
                            <span class="comment-author">${comment.author}</span>
                        </div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Получение названия приоритета
function getPriorityName(priority) {
    switch(priority) {
        case 'high': return 'Высокий';
        case 'medium': return 'Средний';
        case 'low': return 'Низкий';
        default: return 'Не указан';
    }
}

// Отображение модального окна для изменения статуса
function showChangeStatusModal(request) {
    const modal = document.getElementById('changeStatusModal');
    const statusSelect = document.getElementById('newStatus');
    const saveButton = document.getElementById('saveStatus');
    
    if (!modal || !statusSelect || !saveButton) return;
    
    // Устанавливаем текущий статус
    statusSelect.value = request.status;
    
    // Очищаем поле комментария
    document.getElementById('statusComment').value = '';
    
    // Обработчик для кнопки сохранения
    const saveHandler = function() {
        const newStatus = statusSelect.value;
        const comment = document.getElementById('statusComment').value.trim();
        
        if (newStatus === request.status && comment === '') {
            alert('Статус не изменен или не добавлен комментарий');
            return;
        }
        
        // Обновляем статус заявки
        const requestIndex = requestsData.findIndex(req => req.id === request.id);
        if (requestIndex !== -1) {
            // Обновляем статус
            requestsData[requestIndex].status = newStatus;
            requestsData[requestIndex].statusName = getStatusName(newStatus);
            
            // Добавляем комментарий, если он есть
            if (comment) {
                const now = new Date();
                const dateString = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
                
                requestsData[requestIndex].comments.push({
                    date: dateString,
                    author: 'Оператор',
                    text: `Изменен статус на "${getStatusName(newStatus)}". ${comment}`
                });
            }
            
            // Обновляем отображение заявок
            applyFilters();
            
            // Закрываем модальное окно
            modal.style.display = 'none';
            
            // Удаляем обработчик события
            saveButton.removeEventListener('click', saveHandler);
        }
    };
    
    // Добавляем обработчик события для кнопки сохранения
    saveButton.addEventListener('click', saveHandler);
    
    // Отображаем модальное окно
    modal.style.display = 'block';
}

// Получение названия статуса
function getStatusName(status) {
    switch(status) {
        case 'new': return 'Новая';
        case 'in-progress': return 'В работе';
        case 'resolved': return 'Выполнена';
        case 'cancelled': return 'Отменена';
        default: return 'Неизвестно';
    }
}

// Отображение модального окна для назначения техслужбы
function showAssignTeamModal(request) {
    const modal = document.getElementById('assignTeamModal');
    const teamSelect = document.getElementById('teamSelect');
    const saveButton = document.getElementById('saveTeam');
    
    if (!modal || !teamSelect || !saveButton) return;
    
    // Устанавливаем текущую техслужбу
    teamSelect.value = request.team;
    
    // Очищаем поле комментария
    document.getElementById('teamComment').value = '';
    
    // Обработчик для кнопки сохранения
    const saveHandler = function() {
        const newTeam = teamSelect.value;
        const comment = document.getElementById('teamComment').value.trim();
        
        if (newTeam === request.team && comment === '') {
            alert('Техслужба не изменена или не добавлен комментарий');
            return;
        }
        
        // Обновляем техслужбу заявки
        if (newTeam && requestsData[requestIndex].status === 'new') {
            requestsData[requestIndex].status = 'in-progress';
            requestsData[requestIndex].statusName = 'В работе';
        }
        
        // Добавляем комментарий, если он есть
        if (comment || newTeam !== request.team) {
            const now = new Date();
            const dateString = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
            
            let commentText = '';
            if (newTeam) {
                commentText = `Назначена ${getTeamName(newTeam)}. `;
            } else {
                commentText = 'Техслужба снята с заявки. ';
            }
            
            if (comment) {
                commentText += comment;
            }
            
            requestsData[requestIndex].comments.push({
                date: dateString,
                author: 'Оператор',
                text: commentText
            });
        }
        
        // Обновляем отображение заявок
        applyFilters();
        
        // Закрываем модальное окно
        modal.style.display = 'none';
        
        // Удаляем обработчик события
        saveButton.removeEventListener('click', saveHandler);
    };
    
    // Добавляем обработчик события для кнопки сохранения
    saveButton.addEventListener('click', saveHandler);
    
    // Отображаем модальное окно
    modal.style.display = 'block';
}

// Получение названия техслужбы
function getTeamName(team) {
    switch(team) {
        case 'team1': return 'Техслужба №1';
        case 'team2': return 'Техслужба №2';
        case 'team3': return 'Техслужба №3';
        case 'team4': return 'Техслужба №4';
        default: return 'Неизвестная техслужба';
    }
}

// Применение фильтров к заявкам
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const addressFilter = document.getElementById('addressFilter').value.toLowerCase();
    
    let filteredRequests = [...requestsData];
    
    // Фильтр по статусу
    if (statusFilter !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.status === statusFilter);
    }
    
    // Фильтр по типу
    if (typeFilter !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.type === typeFilter);
    }
    
    // Фильтр по дате
    if (dateFilter) {
        filteredRequests = filteredRequests.filter(request => request.date === dateFilter);
    }
    
    // Фильтр по адресу
    if (addressFilter) {
        filteredRequests = filteredRequests.filter(request => 
            request.address.toLowerCase().includes(addressFilter)
        );
    }
    
    // Отображаем отфильтрованные заявки
    displayRequests(filteredRequests);
}

// Инициализация обработчиков событий для фильтров и модальных окон
function initRequestsSection() {
    // Обработчики для фильтров
    const applyFiltersButton = document.getElementById('applyFilters');
    const resetFiltersButton = document.getElementById('resetFilters');
    
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', function() {
            // Сбрасываем значения фильтров
            document.getElementById('statusFilter').value = 'all';
            document.getElementById('typeFilter').value = 'all';
            document.getElementById('dateFilter').value = '';
            document.getElementById('addressFilter').value = '';
            
            // Применяем фильтры (показываем все заявки)
            applyFilters();
        });
    }
    
    // Обработчики для закрытия модальных окон
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Закрытие модального окна при клике вне его содержимого
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Отображаем заявки
    displayRequests();
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация отображения данных приборов учета
    // Инициализация секции заявок
    initRequestsSection();
    displayMetersData();
    // Инициализация карты
    initEmergencyMap();
    // Инициализация отображения состояния оборудования
    displayEquipmentStatus();
    // Инициализация отображения состояния коммуникационных линий
    displayCommunicationStatus();

    // Тестовые данные для графиков
    const dailyData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
            label: 'Потребление за день (Гкал)',
            data: [2.1, 1.8, 2.5, 3.2, 2.8, 2.3],
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            fill: true
        }]
    };

    const monthlyData = {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
        datasets: [{
            label: 'Потребление за месяц (Гкал)',
            data: [150, 130, 100, 80, 40, 20],
            borderColor: '#9b59b6',
            backgroundColor: 'rgba(155, 89, 182, 0.1)',
            fill: true
        }]
    };

    // Настройки графиков
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    // Инициализация графиков
    const dailyChart = new Chart(
        document.getElementById('dailyConsumptionChart'),
        {
            type: 'line',
            data: dailyData,
            options: chartOptions
        }
    );

    const monthlyChart = new Chart(
        document.getElementById('monthlyConsumptionChart'),
        {
            type: 'line',
            data: monthlyData,
            options: chartOptions
        }
    );
});