document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('application-form');
    const popup = document.getElementById('popup');
    const closePopupButton = document.getElementById('close-popup');

    if (!form || !popup || !closePopupButton) {
        console.error("Не знайдено необхідні елементи.");
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        fetch('/Contact', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then(data => {
            console.log("Успішно:", data);
            popup.style.display = 'flex'; // показати спливаюче вікно
        })
        .catch(err => {
            console.error("Помилка відправки:", err);
        });
    });

    closePopupButton.addEventListener('click', () => {
        popup.style.display = 'none';
        form.reset(); // очищення форми
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form2 = document.getElementById('application-form2');
    const popup2 = document.getElementById('popup-mb');
    const closePopupButton2 = document.getElementById('close-popup-mb');

    if (!form2 || !popup2 || !closePopupButton2) {
        console.error("Не знайдено необхідні елементи.");
        return;
    }

    form2.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form2);

        fetch('/Contact', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then(data => {
            console.log("Успішно:", data);
            popup2.style.display = 'flex'; // показати спливаюче вікно
        })
        .catch(err => {
            console.error("Помилка відправки:", err);
        });
    });

    closePopupButton2.addEventListener('click', () => {
        popup2.style.display = 'none';
        form2.reset(); // очищення форми
    });
});
