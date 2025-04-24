// Отримуємо всі кнопки та картки
const buttons = document.querySelectorAll('.button1');
const buttons2 = document.querySelectorAll('.buttons');
const cards = document.querySelectorAll('.cards');

buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Знімаємо клас "active" зі всіх кнопок
      buttons.forEach(btn => btn.classList.remove('active'));
      // Додаємо клас "active" на натиснуту кнопку
      button.classList.add('active');
      
      // Отримуємо значення data-id з натиснутої кнопки
      const filterId = button.getAttribute('data-id');
      
      // Фільтруємо картки за id
      cards.forEach(card => {
        if (filterId === 'all' || card.id === filterId) {
            card.classList.remove('hide')
            card.classList.add('show'); // Показуємо відповідні картки
        } else {
            card.classList.remove('show'); // Ховаємо інші картки
            card.classList.add('hide')
        }
      });
    });
  });
  buttons2.forEach(button => {
    button.addEventListener('click', () => {
      // Знімаємо клас "active" зі всіх кнопок
      buttons2.forEach(btn => btn.classList.remove('active'));
      // Додаємо клас "active" на натиснуту кнопку
      button.classList.add('active');
      
      // Отримуємо значення data-id з натиснутої кнопки
      const filterId = button.getAttribute('data-id');
      
      // Фільтруємо картки за id
      cards.forEach(card => {
        if (filterId === 'all' || card.id === filterId) {
            card.classList.remove('hide')
            card.classList.add('show'); // Показуємо відповідні картки
        } else {
            card.classList.remove('show'); // Ховаємо інші картки
            card.classList.add('hide')
        }
      });
    });
  });