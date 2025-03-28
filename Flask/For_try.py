


lst = [
    1, 1, 'text', 2, 0, 34, 'polina'
]

for element in lst:
    if isinstance(element, int):  # Перевіряємо, чи є елемент числом
        print(f"перший об'єкт: {element}")
    else:
        print(f"перший об'єкт: {element}")  # Виводимо елемент без змін, якщо це не число


for element in lst:
    if str(lst[element] == 2):
        print('hi')