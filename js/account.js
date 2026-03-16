// Функции для работы с данными лицевого счета
let accountData = {
    balance: 0,
    operations: [],
    requests: []
};

// Загрузка данных лицевого счета
async function loadAccountData() {
    try {
        // TODO: Здесь будет API запрос для получения данных
        // Временные тестовые данные
        accountData = {
            balance: 1250.50,
            operations: [
                { date: '2025-04-15', type: 'charges', amount: -850.00, description: 'Начисление за водоснабжение' },
                { date: '2025-04-20', type: 'payments', amount: 1000.00, description: 'Оплата услуг' }
            ],
            requests: [
                { 
                    date: '2025-03-10', 
                    type: 'repair', 
                    status: 'completed',
                    description: 'Ремонт радиатора'
                }
            ]
        };
        updateAccountInfo();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Обновление информации на странице
function updateAccountInfo() {
    const balanceElement = document.getElementById('currentBalance');
    if (balanceElement) {
        balanceElement.textContent = `${accountData.balance.toFixed(2)} ₽`;
    }
    updateOperationsHistory();
    updateRequestsHistory();
}

// Обновление истории операций с учетом фильтров
function updateOperationsHistory() {
    const historyContainer = document.getElementById('operationsHistory');
    const operationType = document.getElementById('operationType').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    const filteredOperations = accountData.operations.filter(operation => {
        const matchesType = operationType === 'all' || operation.type === operationType;
        const operationDate = new Date(operation.date);
        const matchesDateFrom = !dateFrom || operationDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || operationDate <= new Date(dateTo);
        return matchesType && matchesDateFrom && matchesDateTo;
    });

    historyContainer.innerHTML = filteredOperations.map(operation => `
        <div class="operation-item ${operation.type}">
            <div class="operation-date">${formatDate(operation.date)}</div>
            <div class="operation-description">${operation.description}</div>
            <div class="operation-amount">${formatAmount(operation.amount)}</div>
        </div>
    `).join('');
}

// Обновление истории заявок
function updateRequestsHistory() {
    const historyContainer = document.getElementById('requestsHistory');
    historyContainer.innerHTML = accountData.requests.map(request => `
        <div class="request-item ${request.status}">
            <div class="request-date">${formatDate(request.date)}</div>
            <div class="request-type">${getRequestTypeText(request.type)}</div>
            <div class="request-status">${getStatusText(request.status)}</div>
            <div class="request-description">${request.description}</div>
        </div>
    `).join('');
}

// Обработка отправки формы заявки
document.getElementById('serviceRequestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = {
        type: document.getElementById('requestType').value,
        address: document.getElementById('requestAddress').value,
        description: document.getElementById('requestDescription').value,
        phone: document.getElementById('requestPhone').value,
        preferredDate: document.getElementById('requestDate').value
    };

    try {
        // TODO: Здесь будет API запрос для отправки заявки
        console.log('Отправка заявки:', formData);
        // Временная имитация успешной отправки
        accountData.requests.push({
            date: new Date().toISOString().split('T')[0],
            type: formData.type,
            status: 'pending',
            description: formData.description
        });
        updateRequestsHistory();
        this.reset();
        alert('Заявка успешно отправлена!');
    } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
    }
});

// Вспомогательные функции
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU');
}

function formatAmount(amount) {
    return `${amount.toFixed(2)} ₽`;
}

function getRequestTypeText(type) {
    const types = {
        repair: 'Ремонтные работы',
        verification: 'Поверка приборов',
        replacement: 'Замена оборудования'
    };
    return types[type] || type;
}

function getStatusText(status) {
    const statuses = {
        pending: 'В обработке',
        approved: 'Одобрено',
        completed: 'Выполнено',
        rejected: 'Отклонено'
    };
    return statuses[status] || status;
}

// Инициализация фильтров
document.getElementById('applyFilters').addEventListener('click', updateOperationsHistory);

// Загрузка данных при загрузке страницы
document.addEventListener('DOMContentLoaded', loadAccountData);