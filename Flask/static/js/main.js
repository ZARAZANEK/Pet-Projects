
let currentImageIndex = 0;
const images = document.querySelectorAll('.image');
const totalImages = images.length;

// Перевіряємо, чи користувач знаходиться на головній сторінці
if (window.location.pathname === '/main') {
    // Перевіряємо, чи є зображення
    if (totalImages > 0) {
        function showNextImage() {
            images[currentImageIndex].classList.remove('show');
            images[currentImageIndex].classList.add('hide');
            currentImageIndex = (currentImageIndex + 1) % totalImages;
            images[currentImageIndex].classList.remove('hide');
            images[currentImageIndex].classList.add('show');
        }

        // Показуємо перше зображення
        images[currentImageIndex].classList.add('show');

        // Запускаємо автоматичну зміну зображень
        setInterval(showNextImage, 4000); // Змінюємо зображення кожні 4 секунди
    } else {
        console.warn('Зображення з класом ".image" не знайдені.');
    }
} else {
    console.log('Користувач не на головній сторінці. Зображення не будуть показані.');
}

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


window.addEventListener('scroll', function () {
    var elements = [];

    // Перевірка на головну сторінку "/main"
    if (window.location.pathname === '/main') {
        elements = elements.concat([
            'BgMain4', 'BgMain5', 'BgMain6', 'BgMain7', 'BgMain8', 'BgMain9',
            'liniy-1-1', 'liniy-1-2', 'liniy-2-1', 'liniy-2-2',
            'liniy-3-1', 'liniy-3-2', 'liniy-4-1', 'liniy-4-2',
            'liniy-5-1', 'liniy-5-2', 'liniy-6-1', 'liniy-6-2',
            'mainText1', 'mainText2', 'mainText3', 'mainText4', 'mainText5', 'mainText6'
        ]);
    }

    // Перевірка на сторінку "/about"
    if (window.location.pathname === '/about') {
        var elements  = [];
        elements = elements.concat([
            'Bg2About1', 'Bg2About2', 'Bg2About3', 'Bg2About4',
            'BgAbout1', 'BgAbout2', 'BgAbout3', 'BgAbout4', 'BgAbout5',
            'about-cube-low1', 'about-cube-low2', 'about-cube-low3', 'about-cube-low4',
            'about-text1', 'about-text2', 'about-text3', 'about-text4', 'about-text5', 'about-text6',
            'about-text7', 'about-text8', 'about-text9', 'about-text10', 'about-text11', 'about-text12',
            'about-text13', 'about-text14', 'about-text15',
            'about-number1', 'about-number2', 'about-number3', 'about-number4', 'about-number5',
            'about2-number1', 'about2-number2', 'about2-number3', 'about2-number4', 'about2-number5'
        ]);
    }

    if (window.location.pathname === '/details') {
        var elements  = [];
        elements = elements.concat([
            'text1', 'text2', 'text3', 'text4', 'text5', 'text6', 'text7', 'text8', 'text9', 'text10',
            'Bgdetail1', 'Bgdetail2', 'Bgdetail3', 'img1']);
    }

    // Обробка зібраних елементів
    elements.forEach(function (id) {
        var element = document.getElementById(id);
        if (element) {
            try {
                var position = element.getBoundingClientRect().top;
                var screenHeight = window.innerHeight;

                if (position < screenHeight && position > 0) {
                    element.classList.add('visible');
                } else {
                    element.classList.remove('visible');
                }
            } catch (error) {
                console.error(`Помилка обробки елемента з id "${id}":`, error);
            }
        } else {
            console.warn(`Елемент із id "${id}" не знайдено.`);
        }
    });
});

// Відстеження руху миші
document.addEventListener('mousemove', function (e) {
    const magnets = document.querySelectorAll('.magnet');
    magnets.forEach(magnet => {
        try {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            magnet.style.setProperty('--mouse-x', `${x}px`);
            magnet.style.setProperty('--mouse-y', `${y}px`);
        } catch (error) {
            console.error('Помилка обробки магніта:', error);
        }
    });
});



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

var savedAboutBg1 = localStorage.getItem('BgAbout1');
var savedAboutBg2 = localStorage.getItem('BgAbout2');
var savedAboutBg3 = localStorage.getItem('BgAbout3');
var savedAboutBg4 = localStorage.getItem('BgAbout4');
var savedAboutBg5 = localStorage.getItem('BgAbout5');

var savedAbout2Bg1 = localStorage.getItem('Bg2About1');
var savedAbout2Bg2 = localStorage.getItem('Bg2About2');
var savedAbout2Bg3 = localStorage.getItem('Bg2About3');
var savedAbout2Bg4 = localStorage.getItem('Bg2About4');

var savedBgdetail1 = localStorage.getItem('background2-main-cube-add');
var savedBgdetail2 = localStorage.getItem('background2-main-cube-add');
var savedBgdetail3 = localStorage.getItem('background2-main-cube-add');

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
    savedBgMain9,

    savedAboutBg1,
    savedAboutBg2,
    savedAboutBg3,
    savedAboutBg4,
    savedAboutBg5,
    savedAbout2Bg1,
    savedAbout2Bg2,
    savedAbout2Bg3,
    savedAbout2Bg4,

    savedBgdetail1,
    savedBgdetail2,
    savedBgdetail3
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
    var BgAbout1 = document.getElementById('BgAbout1');   
    if (BgAbout1) {
        BgAbout1.style.backgroundColor = savedAboutBg1;
    }
    var BgAbout2 = document.getElementById('BgAbout2');   
    if (BgAbout2) {
        BgAbout2.style.backgroundColor = savedAboutBg2;
    }
    var BgAbout3 = document.getElementById('BgAbout3');   
    if (BgAbout3) {
        BgAbout3.style.backgroundColor = savedAboutBg3;
    }
    var BgAbout4 = document.getElementById('BgAbout4');  
    if (BgAbout4) {
        BgAbout4.style.backgroundColor = savedAboutBg4;
    }
    var BgAbout5 = document.getElementById('BgAbout5');  
    if (BgAbout5) {
        BgAbout5.style.backgroundColor = savedAboutBg5;
    }
    var Bg2About1 = document.getElementById('Bg2About1');   
    if (Bg2About1) {
        Bg2About1.style.backgroundColor = savedAbout2Bg1;
    }
    var Bg2About2 = document.getElementById('Bg2About2');   
    if (Bg2About2) {
        Bg2About2.style.backgroundColor = savedAbout2Bg2;
    }
    var Bg2About3 = document.getElementById('Bg2About3');   
    if (Bg2About3) {
        Bg2About3.style.backgroundColor = savedAbout2Bg3;
    }
    var Bg2About4 = document.getElementById('Bg2About4');   
    if (Bg2About4) {
        Bg2About4.style.backgroundColor = savedAbout2Bg4;
    }
    var Bgdetail1 = document.getElementById('Bgdetail1');
    if (Bgdetail1) {
        Bgdetail1.style.backgroundColor = savedBgdetail1;
    }
    var Bgdetail2 = document.getElementById('Bgdetail2');
    if (Bgdetail2) {
        Bgdetail2.style.backgroundColor = savedBgdetail2;
    }
    var Bgdetail3 = document.getElementById('Bgdetail3');
    if (Bgdetail3) {
        Bgdetail3.style.backgroundColor = savedBgdetail3;
    }
};

var button_dark = document.getElementById('darkTheme');
if (button_dark) {
    console.log('Button dark theme has been found');
    button_dark.addEventListener('click', function() {
        console.log('Button dark theme has been clicked!!!!')
        var headerContainer = document.querySelector('header');
        var buttons_dark = document.querySelectorAll('.button');
        var background = document.getElementById('background');
        var footer = document.getElementById('footer');
        var overplayBackground = document.getElementById('background-overlay');
            document.body.style.backgroundColor = '#1c1c1c';
            document.body.style.color = '#e0e0e0';
            headerContainer.style.backgroundColor = "#333333"; // Темно-сірий фон для заголовка
            headerContainer.style.boxShadow = "none"; // Видаляємо тінь
            buttons_dark.forEach(button => {
                button.style.backgroundColor = '#008CBA';
                button.style.color = '#ffffff';
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
            if (BgAbout1) {
                BgAbout1.style.backgroundColor = "#333333";
            }
            if (BgAbout2) {
                BgAbout2.style.backgroundColor = "#333333";
            }
            if (BgAbout3) {
                BgAbout3.style.backgroundColor = "#333333";
            }
            if (BgAbout4) {
                BgAbout4.style.backgroundColor = "#333333";
            }
            if (BgAbout5) {
                BgAbout5.style.backgroundColor = "#333333";
            }
            if (Bg2About1) {
                Bg2About1.style.backgroundColor = "#333333";
            }
            if (Bg2About2) {
                Bg2About2.style.backgroundColor = "#333333";
            }
            if (Bg2About3) {
                Bg2About3.style.backgroundColor = "#333333";
            }
            if (Bg2About4) {
                Bg2About4.style.backgroundColor = "#333333";
            }
            if (Bgdetail1) {
                Bgdetail1.style.backgroundColor = "#333333";
            }
            if (Bgdetail2) {
                Bgdetail2.style.backgroundColor = "#333333";
            }
            if (Bgdetail3) {
                Bgdetail3.style.backgroundColor = "#333333";
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

            localStorage.setItem('BgAbout1', "#333333");
            localStorage.setItem('BgAbout2', "#333333");
            localStorage.setItem('BgAbout3', "#333333");
            localStorage.setItem('BgAbout4', "#333333");
            localStorage.setItem('BgAbout5', "#333333");

            localStorage.setItem('Bg2About1', "#333333");
            localStorage.setItem('Bg2About2', "#333333");
            localStorage.setItem('Bg2About3', "#333333");
            localStorage.setItem('Bg2About4', "#333333");
            localStorage.setItem('background2-main-cube-add', "#333333")
            localStorage.setItem('background2-main-cube-add', "#333333")
            localStorage.setItem('background2-main-cube-add', "#333333")
    })
}

var button_light = document.getElementById('lightTheme');
if (button_light) {
    console.log('Light dark theme has been found');
    button_light.addEventListener('click', function() {
        console.log('Button light theme has been clicked!!!!')
        var headerContainer = document.querySelector('header');
        var buttons_light = document.querySelectorAll('.button');
        var background = document.getElementById('background');
        var footer = document.getElementById('footer');
        var overplayBackground = document.getElementById('background-overlay');

  
            document.body.style.backgroundColor = '#f0f0f0';
            document.body.style.color = '#333333';
            headerContainer.style.backgroundColor = "#e0e0e0"; // Темно-сірий фон для заголовка
            headerContainer.style.boxShadow = "0 5px 25px rgba(0, 0, 0, 0.15)";
            buttons_light.forEach(button => {
                button.style.backgroundColor = '#571F1C';
                button.style.color = '#ffffff';
            });
            if (background) {
                background.style.backgroundImage = "url('bmwm5.jpg')"; // Фонове зображення
            }
            if (footer) {
                footer.style.backgroundColor = "#e0e0e0"; // Темно-сірий фон для футера
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
            if (BgAbout1) {
                BgAbout1.style.backgroundColor = "#e0e0e0";
            }
            if (BgAbout2) {
                BgAbout2.style.backgroundColor = "#e0e0e0";
            }
            if (BgAbout3) {
                BgAbout3.style.backgroundColor = "#e0e0e0";
            }
            if (BgAbout4) {
                BgAbout4.style.backgroundColor = "#e0e0e0";
            }
            if (BgAbout5) {
                BgAbout5.style.backgroundColor = "#e0e0e0";
            }
            if (Bg2About1) {
                Bg2About1.style.backgroundColor = "#e0e0e0";
            }
            if (Bg2About2) {
                Bg2About2.style.backgroundColor = "#e0e0e0";
            }
            if (Bg2About3) {
                Bg2About3.style.backgroundColor = "#e0e0e0";
            }
            if (Bg2About4) {
                Bg2About4.style.backgroundColor = "#e0e0e0";
            }
            if (Bgdetail1) {
                Bgdetail1.style.backgroundColor = "#e0e0e0";
            }
            if (Bgdetail2) {
                Bgdetail2.style.backgroundColor = "#e0e0e0";
            }
            if (Bgdetail3) {
                Bgdetail3.style.backgroundColor = "#e0e0e0";
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

            localStorage.setItem('BgAbout1', "#e0e0e0");
            localStorage.setItem('BgAbout2', "#e0e0e0");
            localStorage.setItem('BgAbout3', "#e0e0e0");
            localStorage.setItem('BgAbout4', "#e0e0e0");
            localStorage.setItem('BgAbout5', "#e0e0e0");

            localStorage.setItem('Bg2About1', "#e0e0e0");
            localStorage.setItem('Bg2About2', "#e0e0e0");
            localStorage.setItem('Bg2About3', "#e0e0e0");
            localStorage.setItem('Bg2About4', "#e0e0e0");

            localStorage.setItem('background2-main-cube-add', "#e0e0e0");
            localStorage.setItem('background2-main-cube-add', "#e0e0e0");
            localStorage.setItem('background2-main-cube-add', "#e0e0e0");

    })
};

var button_auto = document.getElementById('autoTheme');
if (button_auto) {
    console.log('Button auto theme has been found');
    button_auto.addEventListener('click', function() {
        console.log('Button auto theme has been clicked!!!!')
        var headerContainer = document.querySelector('header');
        var buttons_auto = document.querySelectorAll('.button');
        var background = document.getElementById('background');
        var footer = document.getElementById('footer');
        var overplayBackground = document.getElementById('background-overlay');
            document.body.style.backgroundColor = '#1c1c1c';
            document.body.style.color = '#e0e0e0';
            headerContainer.style.backgroundColor = "#333333"; // Темно-сірий фон для заголовка
            headerContainer.style.boxShadow = "none"; // Видаляємо тінь
            buttons_auto.forEach(button => {
                button.style.backgroundColor = '#008CBA';
                button.style.color = '#ffffff';
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

    })
};


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

