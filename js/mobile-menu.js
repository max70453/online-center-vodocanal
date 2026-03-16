// Инициализация мобильного меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // Обработчик клика по кнопке меню
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Предотвращаем закрытие меню при клике по самому меню
        navLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Закрытие меню при клике вне его области
        document.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initMobileMenu);