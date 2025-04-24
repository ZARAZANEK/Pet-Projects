// Отримуємо елементи
const toggleButton = document.querySelector('button'); // Кнопка
const links = document.querySelectorAll('header a'); // Тільки посилання
const line = document.getElementById('line-header')

toggleButton.style.backgroundImage = "url('static/image/justify.svg'";
toggleButton.style.backgroundRepeat = "no-repeat"; // Виключаємо повторення
toggleButton.style.backgroundSize = "cover"; // Робимо зображення на всю кнопку
toggleButton.style.filter = "invert(100%)"; 

let IsMenuOpen = false;

// Додаємо обробник події для кнопки
toggleButton.addEventListener('click', () => {
    links.forEach(link => {
        if (link.classList.contains('hide')) {
            link.classList.remove('hide');
            link.classList.add('show'); // Показуємо тільки посилання
            line.style.marginTop = '278px';
        } else {
            link.classList.remove('show');
            link.classList.add('hide'); // Ховаємо тільки посилання
            line.style.marginTop = '55px';
        }
    });
    if (IsMenuOpen) {
        toggleButton.style.backgroundImage = "url('static/image/x.svg'";
        toggleButton.style.width = '24px';
        toggleButton.style.height = '24px';
        toggleButton.style.backgroundRepeat = "no-repeat"; // Виключаємо повторення
        toggleButton.style.backgroundSize = "cover"; // Робимо зображення на всю кнопку
        toggleButton.style.filter = "invert(100%)"; 
        IsMenuOpen = false;
    } else {
        toggleButton.style.backgroundImage = "url('static/image/justify.svg'";
        toggleButton.style.width = '32px';
        toggleButton.style.height = '32px';
        toggleButton.style.backgroundRepeat = "no-repeat"; // Виключаємо повторення
        toggleButton.style.backgroundSize = "cover"; // Робимо зображення на всю кнопку
        toggleButton.style.filter = "invert(100%)"; 
        IsMenuOpen = true;
    }
});

