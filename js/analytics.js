// Инициализация графиков при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupEventListeners();
});

// Инициализация графиков
function initializeCharts() {
    // График динамики потребления
    const trendCtx = document.getElementById('consumptionTrendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [{
                label: 'Потребление ресурсов',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#3498db',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Динамика потребления за 6 месяцев'
                }
            }
        }
    });

    // График эффективности
    // const efficiencyCtx = document.getElementById('efficiencyChart').getContext('2d');
    // new Chart(efficiencyCtx, {
    //     type: 'bar',
    //     data: {
    //         labels: ['Участок 1', 'Участок 2', 'Участок 3', 'Участок 4', 'Участок 5'],
    //         datasets: [{
    //             label: 'Эффективность использования (%)',
    //             data: [85, 92, 78, 95, 88],
    //             backgroundColor: '#2ecc71'
    //         }]
    //     },
    //     options: {
    //         responsive: true,
    //         plugins: {
    //             title: {
    //                 display: true,
    //                 text: 'Эффективность по участкам'
    //             }
    //         }
    //     }
    // });
}

// Настройка обработчиков событий
function setupEventListeners() {
    const generateBtn = document.getElementById('generateReport');
    generateBtn.addEventListener('click', generateReport);
}

// Генерация отчета
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportPeriod = document.getElementById('reportPeriod').value;

    // Пример генерации отчета
    const reportPreview = document.getElementById('reportPreview');
    reportPreview.innerHTML = `
        <h3>Отчет: ${getReportTypeName(reportType)}</h3>
        <p>Период: ${getReportPeriodName(reportPeriod)}</p>
        <div class="report-content">
            <p>Основные показатели:</p>
            <ul>
                <li>Общее потребление: 1250 кВт⋅ч</li>
                <li>Средняя эффективность: 85%</li>
                <li>Потенциал экономии: 15%</li>
            </ul>
            <p>Рекомендации по улучшению:</p>
            <ul>
                <li>Внедрение автоматизированной системы учета</li>
                <li>Модернизация оборудования на участках А и С</li>
                <li>Оптимизация графика работы оборудования</li>
            </ul>
        </div>
    `;
}

// Вспомогательные функции
function getReportTypeName(type) {
    const types = {
        'consumption': 'Потребление ресурсов',
        'efficiency': 'Энергоэффективность',
        'optimization': 'Рекомендации по оптимизации'
    };
    return types[type] || type;
}

function getReportPeriodName(period) {
    const periods = {
        'week': 'Неделя',
        'month': 'Месяц',
        'quarter': 'Квартал',
        'year': 'Год'
    };
    return periods[period] || period;
}