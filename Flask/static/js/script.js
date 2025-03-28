function updateCounter() {
    const input = document.getElementById('counterInput');
    const counterText = document.getElementById('counterText');
    counterText.textContent = `${input.value}/10`;
}

function showPopup() {
    document.getElementById('popup').classList.add('active');
}

function closePopup() {
    document.getElementById('popup').classList.remove('active');
}


function updateCounter2() {
    const input = document.getElementById('counterInput');
    const counterText = document.getElementById('counterText');
}

function showPopup2() {
    document.getElementById('popup2').classList.add('active');
}

function closePopup2() {
    document.getElementById('popup2').classList.remove('active');
}


function updateCounter3() {
    const input = document.getElementById('counterInput');
    const counterText = document.getElementById('counterText');
}

function showPopup3() {
    document.getElementById('popup3').classList.add('active');
}

function closePopup3() {
    document.getElementById('popup3').classList.remove('active');
}


window.addEventListener('scroll', function() {
    var elements = [
        'BgMain4', 'BgMain5', 'BgMain6', 'BgMain7', 'BgMain8', 'BgMain9',
        'liniy-1-1', 'liniy-1-2', 'liniy-2-1', 'liniy-2-2',
        'liniy-3-1', 'liniy-3-2', 'liniy-4-1', 'liniy-4-2',
        'liniy-5-1', 'liniy-5-2', 'liniy-6-1', 'liniy-6-2',
        'mainText1', 'mainText2', 'mainText3', 'mainText4', 'mainText5', 'mainText6'
    ];

    elements.forEach(function(id) {
        var element = document.getElementById(id);
        var position = element.getBoundingClientRect().top;
        var screenPosition = window.innerHeight;

        if (position < screenPosition && position > 0) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
});

//! -----------------------  Main page ----------------------------------


let currentImageIndex = 0;
const images = document.querySelectorAll('.image');
const totalImages = images.length;

function showNextImage() {
images[currentImageIndex].classList.remove('show');
images[currentImageIndex].classList.add('hide');
currentImageIndex = (currentImageIndex + 1) % totalImages;
images[currentImageIndex].classList.remove('hide');
images[currentImageIndex].classList.add('show');
}

images[currentImageIndex].classList.add('show');
setInterval(showNextImage, 4000); // Змінюємо зображення кожні 4 сек

document.addEventListener('DOMContentLoaded', function() {
console.log('DOMContentLoaded event triggered');

// Завантажуємо збережений фон
var savedBackgroundColor = localStorage.getItem('backgroundColor');
var savedHeaderBackgroundColor = localStorage.getItem('headerBackgroundColor');
var savedTextColor = localStorage.getItem('textColor');
var savedBoxShadow = localStorage.getItem('boxShadow');
var savedButtonColor = localStorage.getItem('buttonColor');
var savedButtonTextColor = localStorage.getItem('buttonTextColor');
var savedBackgroundImage = localStorage.getItem('backgroundImage');
var savedFooterBackgroundColor = localStorage.getItem('footerBackgroundColor');
var savedBackgroundOverplay = localStorage.getItem('background-overlay');

var savedBgMain = localStorage.getItem('BgMain');
var savedBgMain2 = localStorage.getItem('BgMain2');
var savedBgMain3 = localStorage.getItem('BgMain3');

var savedBgMain4 = localStorage.getItem('BgMain4');
var savedBgMain5 = localStorage.getItem('BgMain5');
var savedBgMain6 = localStorage.getItem('BgMain6');
var savedBgMain7 = localStorage.getItem('BgMain7');
var savedBgMain8 = localStorage.getItem('BgMain8');
var savedBgMain9 = localStorage.getItem('BgMain9');

console.log('Loaded settings from localStorage:', {
    savedBackgroundColor,
    savedHeaderBackgroundColor,
    savedTextColor,
    savedBoxShadow,
    savedButtonColor,
    savedButtonTextColor,
    savedBackgroundImage,
    savedFooterBackgroundColor,
    savedBackgroundOverplay,
    savedBgMain, 
    savedBgMain2,
    savedBgMain3,
    savedBgMain4,
    savedBgMain5,
    savedBgMain6,
    savedBgMain7,
    savedBgMain8,
    savedBgMain9
});

if (savedBackgroundColor) {
    document.body.style.backgroundColor = savedBackgroundColor;
    document.body.style.color = savedTextColor;
    var headerContainer = document.querySelector('header');
    headerContainer.style.backgroundColor = savedHeaderBackgroundColor;
    headerContainer.style.boxShadow = savedBoxShadow;
    var buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.style.backgroundColor = savedButtonColor;
        button.style.color = savedButtonTextColor;
    });
    var background = document.getElementById('background');
    if (background) {
        background.style.backgroundImage = savedBackgroundImage;
    }
    var footer = document.getElementById('footer');
    if (footer) {
        footer.style.backgroundColor = savedFooterBackgroundColor;
    }
    var BgMain = document.getElementById('BgMain');
    if (BgMain) {
        BgMain.style.backgroundColor = savedBgMain;
    }
    var BgMain2 = document.getElementById('BgMain2');
    if (BgMain2) {
        BgMain2.style.backgroundColor = savedBgMain2;
    }
    var BgMain3 = document.getElementById('BgMain3');
    if (BgMain3) {
        BgMain3.style.backgroundColor = savedBgMain3;
    }
    var BgMain4 = document.getElementById('BgMain4');
    if (BgMain4) {
        BgMain4.style.backgroundColor = savedBgMain4;
    }
    var BgMain5 = document.getElementById('BgMain5');
    if (BgMain5) {
        BgMain5.style.backgroundColor = savedBgMain5;
    }
    var BgMain6 = document.getElementById('BgMain6');
    if (BgMain6) {
        BgMain6.style.backgroundColor = savedBgMain6;
    }
    var BgMain7 = document.getElementById('BgMain7');
    if (BgMain7) {
        BgMain7.style.backgroundColor = savedBgMain7;
    }
    var BgMain8 = document.getElementById('BgMain8');
    if (BgMain8) {
        BgMain8.style.backgroundColor = savedBgMain8;
    }
    var BgMain9 = document.getElementById('BgMain9');
    if (BgMain9) {
        BgMain9.style.backgroundColor = savedBgMain9;
    }
}

var button_dark = document.getElementById('darkTheme');
if (button_dark) {

    console.log('Found button with id "rotateButton"');
    button_dark.addEventListener('click', function() {
        console.log('Button clicked');
        var headerContainer = document.querySelector('header');
        var buttons_dark = document.querySelectorAll('.button');
        var background = document.getElementById('background');
        var footer = document.getElementById('footer');
        var overplayBackground = document.getElementById('background-overlay');

        this.classList.toggle('rotated');
        if (this.classList.contains('rotated')) {
            this.innerHTML = "Dark";
            document.body.style.backgroundColor = "#1c1c1c"; // Темно-сірий фон
            document.body.style.color = "#e0e0e0"; // Світло-сірий текст
            headerContainer.style.backgroundColor = "#333333"; // Темно-сірий фон для заголовка
            headerContainer.style.boxShadow = "none"; // Видаляємо тінь
            buttons.forEach(button => {
                button.style.backgroundColor = "#008CBA"; // Темно-сірий фон кнопок
                button.style.color = "#ffffff"; // Білий текст на кнопках
            });
            if (background) {
                background.style.backgroundImage = "url('bmwm5.jpg')"; // Фонове зображення
            }
            if (footer) {
                footer.style.backgroundColor = "#333333"; // Темно-сірий фон для футера
            }
            if (overplayBackground) {
                overplayBackground.style.backgroundColor = "#333333"; // Фон для overlay
            }
            if (BgMain) {
                BgMain.style.backgroundColor = "#333333";
            }
            if (BgMain2) {
                BgMain2.style.backgroundColor = "#333333";
            }
            if (BgMain3) {
                BgMain3.style.backgroundColor = "#333333";
            }
            if (BgMain4) {
                BgMain4.style.backgroundColor = "#333333";
            }
            if (BgMain5) {
                BgMain5.style.backgroundColor = "#333333";
            }
            if (BgMain6) {
                BgMain6.style.backgroundColor = "#333333";
            }
            if (BgMain7) {
                BgMain7.style.backgroundColor = "#333333";
            }
            if (BgMain8) {
                BgMain8.style.backgroundColor = "#333333";
            }
            if (BgMain9) {
                BgMain9.style.backgroundColor = "#333333";
            }

            // Зберігаємо вибрані кольори та фон у Local Storage
            localStorage.setItem('backgroundColor', "#1c1c1c");
            localStorage.setItem('headerBackgroundColor', "#333333");
            localStorage.setItem('textColor', "#e0e0e0");
            localStorage.setItem('boxShadow', "none");
            localStorage.setItem('buttonColor', "#008CBA");
            localStorage.setItem('buttonTextColor', "#ffffff");
            localStorage.setItem('backgroundImage', "url('bmwm5.jpg')");
            localStorage.setItem('footerBackgroundColor', "#333333");
            localStorage.setItem('background-overlay', "#333333");

            localStorage.setItem('BgMain', "#333333");
            localStorage.setItem('BgMain2', "#333333");
            localStorage.setItem('BgMain3', "#333333");
            localStorage.setItem('BgMain4', "#333333");
            localStorage.setItem('BgMain5', "#333333");
            localStorage.setItem('BgMain6', "#333333");
            localStorage.setItem('BgMain7', "#333333");
            localStorage.setItem('BgMain8', "#333333");
            localStorage.setItem('BgMain9', "#333333");
        } else {
            this.innerHTML = "White";
            document.body.style.backgroundColor = "#f0f0f0"; // Світло-сірий фон
            document.body.style.color = "#333333"; // Темний текст
            headerContainer.style.backgroundColor = "#e0e0e0"; // Світло-сірий фон для заголовка
            headerContainer.style.boxShadow = "0 5px 25px rgba(0, 0, 0, 0.15)"; // Повертаємо тінь
            buttons.forEach(button => {
                button.style.backgroundColor = "#571F1C"; // Блакитний фон кнопок
                button.style.color = "#ffffff"; // Білий текст на кнопках
            });
            if (background) {
                background.style.backgroundImage = "url('bmwm5.jpg')"; // Фонове зображення
            }
            if (footer) {
                footer.style.backgroundColor = "#e0e0e0"; // Світло-сірий фон для футера
            }
            if (overplayBackground) {
                overplayBackground.style.backgroundColor = "#e0e0e0"; // Фон для overlay
            }
            if (BgMain) {
                BgMain.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain2) {
                BgMain2.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain3) {
                BgMain3.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain4) {
                BgMain4.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain5) {
                BgMain5.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain6) {
                BgMain6.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain7) {
                BgMain7.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain8) {
                BgMain8.style.backgroundColor = "#e0e0e0";
            }
            if (BgMain9) {
                BgMain9.style.backgroundColor = "#e0e0e0";
            }

            // Зберігаємо вибрані кольори та фон у Local Storage
            localStorage.setItem('backgroundColor', "#f0f0f0");
            localStorage.setItem('headerBackgroundColor', "#e0e0e0");
            localStorage.setItem('textColor', "#333333");
            localStorage.setItem('boxShadow', "0 5px 25px rgba(0, 0, 0, 0.15)");
            localStorage.setItem('buttonColor', "#571F1C");
            localStorage.setItem('buttonTextColor', "#ffffff");
            localStorage.setItem('backgroundImage', "url('bmwm5.jpg')");
            localStorage.setItem('footerBackgroundColor', "#e0e0e0");
            localStorage.setItem('background-overlay', "#e0e0e0");

            localStorage.setItem('BgMain', "#e0e0e0");
            localStorage.setItem('BgMain2', "#e0e0e0");
            localStorage.setItem('BgMain3', "#e0e0e0");
            localStorage.setItem('BgMain4', "#e0e0e0");
            localStorage.setItem('BgMain5', "#e0e0e0");
            localStorage.setItem('BgMain6', "#e0e0e0");
            localStorage.setItem('BgMain7', "#e0e0e0");
            localStorage.setItem('BgMain8', "#e0e0e0");
            localStorage.setItem('BgMain9', "#e0e0e0");
        }
    });
} else {
    console.error('Button with id "rotateButton" not found');
}
});

document.addEventListener('DOMContentLoaded', (event) => {
        const dropdownButton = document.querySelector('.dropbtn');
        const dropdownContent = document.querySelector('.dropdown-content');
        const dropdownLinks = dropdownContent.querySelectorAll('a');

        // Відновлення вибраного значення з localStorage
        const savedOption = localStorage.getItem('selectedOption');
        if (savedOption) {
            dropdownLinks.forEach(link => {
                if (link.getAttribute('data-option') === savedOption) {
                    link.classList.add('selected');
                }
            });
        }

        dropdownButton.addEventListener('click', () => {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
                dropdownContent.classList.add('hide');
                setTimeout(() => {
                    dropdownContent.style.display = "none";
                }, 300); // Зачекайте, поки закінчиться анімація
                dropdownButton.style.transform = "rotate(0deg)";
            } else {
                dropdownContent.style.display = "block";
                setTimeout(() => {
                    dropdownContent.classList.remove('hide');
                    dropdownContent.classList.add('show');
                }, 10); // Трохи зачекайте перед запуском анімації
                dropdownButton.style.transform = "rotate(90deg)";
            }
        });

        dropdownLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                dropdownLinks.forEach(l => l.classList.remove('selected'));
                link.classList.add('selected');
                // Збереження вибраного значення в localStorage
                localStorage.setItem('selectedOption', link.getAttribute('data-option'));
                dropdownContent.classList.remove('show');
                dropdownContent.classList.add('hide');
                setTimeout(() => {
                    dropdownContent.style.display = "none";
                }, 300); // Зачекайте, поки закінчиться анімація
                dropdownButton.style.transform = "rotate(0deg)";
            });
        });

        document.addEventListener('click', (event) => {
            if (!dropdownButton.contains(event.target)) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                    dropdownContent.classList.add('hide');
                    setTimeout(() => {
                        dropdownContent.style.display = "none";
                    }, 300); // Зачекайте, поки закінчиться анімація
                    dropdownButton.style.transform = "rotate(0deg)";
                }
            }
        });
    });



    