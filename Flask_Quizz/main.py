from flask import Flask, render_template, request, jsonify, redirect, url_for, session, flash
import sqlite3
import os
import csv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Налаштування баз даних
basedir = os.path.abspath(os.path.dirname(__file__))
card_db_path = os.path.join(basedir, 'card.db')
quiz_db_path = os.path.join(basedir, 'quiz.db')
user_accounts = os.path.join(basedir, 'users.db')
TF_db_path = os.path.join(basedir, 'TF.db')
TF_db_path_questions = os.path.join(basedir, 'TF_questions.db')
Pitania_db_path = os.path.join(basedir, 'Pitania.db')
Pitania_db_path_questions = os.path.join(basedir, 'Pitania_questions.db')

# Створення баз даних та таблиць
def create_databases():
    # Створення бази даних для карток
    conn = sqlite3.connect(card_db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mode TEXT NOT NULL,
            category TEXT NOT NULL,
            creator TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    # Створення бази даних для питань
    conn = sqlite3.connect(quiz_db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            card_name TEXT NOT NULL,
            question_text TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            wrong_answer_1 TEXT NOT NULL,
            wrong_answer_2 TEXT NOT NULL,
            wrong_answer_3 TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    # Створення бази даних для користувачів
    conn = sqlite3.connect(user_accounts)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            quiz_count INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

    # Створення бази даних для True/False питань у правильному файлі
    conn = sqlite3.connect(TF_db_path)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS TF (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mode TEXT NOT NULL,
            category TEXT NOT NULL,
            creator TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    # Створення бази даних для питань
    conn = sqlite3.connect(TF_db_path_questions)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions_TF (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            TF_name TEXT NOT NULL,
            question_text TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            wrong_answer_1 TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

    conn = sqlite3.connect(Pitania_db_path)
    cursor = conn.cursor()
    cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS Pitania (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   Pitania_name TEXT NOT NULL,
                   Pitania_mode TEXT NOT NULL,
                   Pitania_category TEXT NOU NULL,
                   Pitania_creator TEXT NOT NULL
                   ) ''')
    conn.commit()
    conn.close()

    conn = sqlite3.connect(Pitania_db_path_questions)
    cursor = conn.cursor()
    cursor.execute(''' 
        CREATE TABLE IF NOT EXISTS Pitania_questions (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   Pitania_questions_name TEXT NOT NULL,
                   Pitania_question_text TEXT NOT NULL,
                   Pitania_question_current TEXT NOT NULL
                   )''')
    conn.commit()
    conn.close()

create_databases()

# Функція для перевірки існування таблиці
def check_table_exists(table_name):
    conn = sqlite3.connect(TF_db_path_questions)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS questions_TF (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            TF_name TEXT NOT NULL,
            question_text TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            wrong_answer_1 TEXT NOT NULL
        )
    ''')
    conn.commit()
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}';")
    table_exists = cursor.fetchone() is not None
    conn.close()
    return 

#Створення меню
@app.route('/')
@app.route('/Main')
def main():
    conn = sqlite3.connect(card_db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM cards')
    cards = cursor.fetchall()
    conn.close()
    return render_template('Main.html', cards=cards)

#Створення сторінки для показу квізів
@app.route('/Quiz')
def quiz():
    return render_template('quiz.html')

#Створення сторінки для створення квізів
@app.route('/Create_quiz')
def create_quiz():
    return render_template('create_quiz.html')

#Створення сторінки для додавання питань до квізу
@app.route('/Quiz_option')
def quiz_option():
    conn = sqlite3.connect(card_db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT name FROM cards')
    cards = cursor.fetchall()
    conn.close()
    return render_template('quiz_option.html', cards=cards)

#Створення методу для збереження карток для квізу
@app.route('/save_card', methods=['POST'])
def save_card():
    try:
        new_card_data = request.get_json()
        print(f"Отримано нову картку: {new_card_data}")

        if not new_card_data:
            return jsonify({"message": "No card data provided"}), 400

        conn = sqlite3.connect(card_db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO cards (name, mode, category, creator)
            VALUES (?, ?, ?, ?)
        ''', (new_card_data['name'], new_card_data['mode'], new_card_data['category'], new_card_data['creator']))
        conn.commit()
        conn.close()
        print("Картку успішно збережено в базу даних.")

        return jsonify({"message": "Card saved successfully"}), 200
    except Exception as e:
        print(f"Помилка при збереженні картки: {e}")
        return jsonify({"message": "Internal server error"}), 500

#Створення методу для видалення карток квізу
@app.route('/delete_card/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    try:
        conn = sqlite3.connect(card_db_path)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM cards WHERE id = ?', (card_id,))
        conn.commit()
        conn.close()

        if cursor.rowcount > 0:
            print("Картку успішно видалено.")
            return jsonify({"message": "Card deleted successfully"}), 200
        else:
            return jsonify({"message": "Card not found"}), 404
    except Exception as e:
        print(f"Помилка при видаленні картки: {e}")
        return jsonify({"message": "Internal server error"}), 500

#Створення методу для получення карток квізу
@app.route('/get_cards', methods=['GET'])
def get_cards():
    try:
        conn = sqlite3.connect(card_db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM cards')
        cards = cursor.fetchall()
        conn.close()
        return jsonify([{
            'id': card[0],
            'name': card[1],
            'mode': card[2],
            'category': card[3],
            'creator': card[4]
        } for card in cards])
    except Exception as e:
        print(f"Помилка при отриманні карток: {e}")
        return jsonify({"message": "Internal server error"}), 500

#Створення методу для збереження запитань для квізу
@app.route('/save_questions', methods=['POST'])
def save_questions():
    try:
        questions_data = request.get_json()
        card_name = request.args.get('card_name')
        print(f"Отримано питання: {questions_data} для картки: {card_name}")

        if not questions_data or not card_name:
            return jsonify({"message": "No questions data or card name provided"}), 400

        conn = sqlite3.connect(quiz_db_path)
        cursor = conn.cursor()
        for q in questions_data:
            cursor.execute('''
                INSERT INTO questions (card_name, question_text, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (card_name, q['text'], q['correct'], q['wrong_1'], q['wrong_2'], q['wrong_3']))
        conn.commit()
        conn.close()
        print("Питання успішно збережено в базу даних.")

        return jsonify({"message": "Questions saved successfully"}), 200
    except Exception as e:
        print(f"Помилка при збереженні питань: {e}")
        return jsonify({"message": "Internal server error"}), 500

#творення методу щоб получати питання для квізу
@app.route('/get_quiz_questions', methods=['GET'])
def get_quiz_questions():
    card_name = request.args.get('card_name')
    if not card_name:
        return jsonify({"message": "Missing card_name parameter"}), 400

    try:
        conn = sqlite3.connect(quiz_db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT question_text, correct_answer, wrong_answer_1, wrong_answer_2, wrong_answer_3 FROM questions WHERE card_name = ?', (card_name,))
        questions = cursor.fetchall()
        conn.close()

        if questions:
            print(f"Found questions for card '{card_name}': {questions}")  # Debugging statement
        else:
            print(f"No questions found for card '{card_name}'")  # Debugging statement

        formatted_questions = []
        for question in questions:
            formatted_question = {
                'question_text': question[0],
                'correct_answer': question[1],
                'wrong_answers': [answer for answer in question[2:] if answer]
            }
            formatted_questions.append(formatted_question)
        
        return jsonify(formatted_questions)
    except Exception as e:
        print(f"Помилка при отриманні запитань: {e}")
        return jsonify({"message": "Internal server error"}), 500

# Новий маршрут для отримання картки
#Створення методу для отримання запитань до певної картки квізу
@app.route('/fetch_card/<card_name>', methods=['GET'])
def fetch_card(card_name):
    try:
        conn = sqlite3.connect(card_db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM cards WHERE name = ?', (card_name,))
        card = cursor.fetchone()
        conn.close()

        if card:
            return jsonify({
                'id': card[0],
                'name': card[1],
                'mode': card[2],
                'category': card[3],
                'creator': card[4]
            }), 200
        else:
            return jsonify({"message": "Card not found"}), 404
    except Exception as e:
        print(f"Помилка при отриманні картки: {e}")
        return jsonify({"message": "Internal server error"}), 500

#Створення методу для початку гри в квіз
@app.route('/Quiz_game')
def quiz_game():
    return render_template('quiz_game.html')

#творення методу щоб получати питання для квізу
@app.route('/fetch_all_questions/<card_name>', methods=['GET'])
def fetch_all_questions(card_name):
    try:
        conn = sqlite3.connect(quiz_db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM questions WHERE card_name = ?', (card_name,))
        questions = cursor.fetchall()
        conn.close()

        questions_data = []
        for question in questions:
            questions_data.append({
                'id': question[0],
                'card_name': question[1],
                'question_text': question[2],
                'correct_answer': question[3],
                'wrong_answer_1': question[4],
                'wrong_answer_2': question[5],
                'wrong_answer_3': question[6]
            })
            print(question)  # Виведемо питання у консоль

        if not questions_data:
            print(f"No questions found for card '{card_name}'")  # Debugging statement
        return jsonify(questions_data), 200
    except Exception as e:
        print(f"Помилка при отриманні питань: {e}")
        return jsonify({"message": "Internal server error"}), 500


#! ------------------------- NEXT TF -------------------------


#Створення сторінки для показу три фалс
@app.route('/True_or_false')
def TF():
    return render_template('true_or_false.html')

#Створення сторінки для початку гри три фалс
@app.route('/True_or_false_game')
def TF_game():
    return render_template('true_or_false_game.html')

#Створення сторінки для створення три фалс
@app.route('/Create_true_or_false')
def create_TF():
    return render_template('create_true_or_false.html')

@app.route('/true_or_false_option')
def TF_option():
    conn = sqlite3.connect(TF_db_path)
    cursor = conn.cursor()
    cursor.execute('SELECT name FROM TF')
    TF = cursor.fetchall()
    conn.close()
    return render_template('true_or_false_option.html', TF=TF)

#Створення методу для збереження карток для три фалс
@app.route('/saveTF', methods=['POST'])
def saveTF():
    try:
        new_card_data = request.get_json()
        print(f"Отримано нову картку: {new_card_data}")

        if not new_card_data:
            return jsonify({"message": "No card data provided"}), 400

        conn = sqlite3.connect(TF_db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO TF (name, mode, category, creator)
            VALUES (?, ?, ?, ?)
        ''', (new_card_data['name'], new_card_data['mode'], new_card_data['category'], new_card_data['creator']))
        conn.commit()
        conn.close()
        print("Картку успішно збережено в базу даних.")

        return jsonify({"message": "Card saved successfully"}), 200
    except Exception as e:
        print(f"Помилка при збереженні картки: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route('/getTF', methods=['GET'])
def getTF():
    try:
        conn = sqlite3.connect(TF_db_path)  # Підключення до правильного файлу бази даних
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM TF')
        TFS = cursor.fetchall()
        conn.close()
        return jsonify([{
            'id': TF[0],
            'name': TF[1],
            'mode': TF[2],
            'category': TF[3],
            'creator': TF[4]
        } for TF in TFS])
    except Exception as e:
        print(f"Помилка при отриманні карток: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route('/save_questions_TF', methods=['POST'])
def save_questions_TF():
    try:
        questions_data = request.get_json()
        tr = True
        fl = False
        if not questions_data:
            print("No questions data provided")
            return jsonify({"message": "No questions data provided"}), 400

        card_name = request.args.get('TF_name')
        if not card_name:
            print("No card name provided")
            return jsonify({"message": "No card name provided"}), 400

        card_name = card_name.strip('()').replace("'", "").strip()
        print(f"Отримано питання: {questions_data} для картки: {card_name}")

        conn = sqlite3.connect(TF_db_path_questions)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='questions_TF';")
        if not cursor.fetchone():
            print("Table questions_TF does not exist")
            return jsonify({"message": "Table questions_TF does not exist"}), 500

        for q in questions_data:
            cursor.execute('''
                INSERT INTO questions_TF (TF_name, question_text, correct_answer, wrong_answer_1)
                VALUES (?, ?, ?, ?)
            ''', (card_name, q['text'], q['correct'], q['wrong_1']))
        
        conn.commit()
        conn.close()
        print("Питання успішно збережено в базу даних.")

        return jsonify({"message": "Questions saved successfully"}), 200
    except Exception as e:
        print(f"Помилка при збереженні питань: {e}")
        return jsonify({"message": "Internal server error"}), 500

#творення методу щоб получати питання для квізу
@app.route('/get_TF_questions', methods=['GET'])
def get_TF_questions():
    card_name = request.args.get('card_name')
    if not card_name:
        return jsonify({"message": "Missing card_name parameter"}), 400

    try:
        conn = sqlite3.connect(quiz_db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT question_text, correct_answer, wrong_answer_1 FROM questions_TF WHERE card_name = ?', (card_name,))
        questions = cursor.fetchall()
        conn.close()

        if questions:
            print(f"Found questions for card '{card_name}': {questions}")  # Debugging statement
        else:
            print(f"No questions found for card '{card_name}'")  # Debugging statement

        formatted_questions = []
        for question in questions:                                   
            formatted_question = {
                'question_text': question[0],
                'correct_answer': question[1],
                'wrong_answers': [answer for answer in question[2:] if answer]
            }
            formatted_questions.append(formatted_question)
        
        return jsonify(formatted_questions)
    except Exception as e:
        print(f"Помилка при отриманні запитань: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
@app.route('/fetch_all_questions_TF/<card_name>', methods=['GET'])
def fetch_all_questions_TF(card_name):
    try:
        card_name = card_name.strip()
        print(f"Запит на отримання питань для картки: {card_name}")

        conn = sqlite3.connect(TF_db_path_questions)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM questions_TF WHERE TF_name = ?', (card_name,))
        questions = cursor.fetchall()
        conn.close()

        questions_data = []
        for question in questions:
            questions_data.append({
                'id': question[0],
                'TF_name': question[1],
                'question_text': question[2],
                'correct_answer': question[3],
                'wrong_answer_1': question[4],
            })
            print(question)  # Виведемо питання у консоль

        if not questions_data:
            print(f"No questions found for card '{card_name}'")  # Debugging statement
        return jsonify(questions_data), 200
    except Exception as e:
        print(f"Помилка при отриманні питань: {e}")
        return jsonify({"message": "Internal server error"}), 500


#! ------------------------- NEXT Pitania -------------------------


@app.route('/Pitania')
def pitania():
    return render_template('pitania.html')

@app.route('/Create_pitania')
def create_pitania():
    return render_template('create_pitania.html')

@app.route('/Pitania_game')
def pitania_game():
    return render_template('pitania_game.html')

@app.route('/Pitania_option')
def pitania_option():
    with sqlite3.connect(Pitania_db_path) as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Pitania_name FROM Pitania')
        Pitania = cursor.fetchall()
        print(f"Доступные картки: {Pitania}")  # Debugging statement
    return render_template('pitania_option.html', Pitania=Pitania)

#Створення методу для збереження карток для три фалс
@app.route('/save_Pitania', methods=['POST'])
def save_Pitania():
    try:
        new_Pitania_data = request.get_json()
        print(f"Отримано нову картку: {new_Pitania_data}")

        if not new_Pitania_data:
            return jsonify({"message": "No card data provided"}), 400

        conn = sqlite3.connect(Pitania_db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Pitania (Pitania_name, Pitania_mode, Pitania_category, Pitania_creator)
            VALUES (?, ?, ?, ?)
        ''', (new_Pitania_data['Pitania_name'], new_Pitania_data['Pitania_mode'], new_Pitania_data['Pitania_category'], new_Pitania_data['Pitania_creator']))
        conn.commit()
        conn.close()
        print("Картку успішно збережено в базу даних.")

        return jsonify({"message": "Card saved successfully"}), 200
    except Exception as e:
        print(f"Помилка при збереженні картки: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route('/get_Pitania', methods=['GET'])
def get_Pitania():
    try:
        conn = sqlite3.connect(Pitania_db_path)  # Підключення до правильного файлу бази даних
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Pitania')
        TFS = cursor.fetchall()
        conn.close()
        return jsonify([{
            'id': TF[0],
            'Pitania_name': TF[1],
            'Pitania_mode': TF[2],
            'Pitania_category': TF[3],
            'Pitania_creator': TF[4]
        } for TF in TFS])
    except Exception as e:
        print(f"Помилка при отриманні карток: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
#творення методу щоб получати питання для квізу
@app.route('/get_Pitania_questions', methods=['GET'])
def get_Pitania_questions():
    Pitania_name = request.args.get('Pitania_questions_name')
    if not Pitania_name:
        return jsonify({"message": "Missing Pitania_name parameter"}), 400

    try:
        conn = sqlite3.connect(Pitania_db_path_questions)
        cursor = conn.cursor()
        cursor.execute('SELECT Pitania_question_text, Pitania_question_current FROM Pitania_questions WHERE Pitania_questions_name = ?', (Pitania_name,))
        questions = cursor.fetchall()
        conn.close()

        if questions:
            print(f"Found questions for card '{Pitania_name}': {questions}")  # Debugging statement
        else:
            print(f"No questions found for card '{Pitania_name}'")  # Debugging statement

        formatted_questions = []
        for question in questions:                                   
            formatted_question = {
                'Pitania_question_text': question[0],
                'Pitania_question_current': question[1],
            }
            formatted_questions.append(formatted_question)
        
        return jsonify(formatted_questions)
    except Exception as e:
        print(f"Помилка при отриманні запитань: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route('/fetch_all_questions_Pitania/<card_name>', methods=['GET'])
def fetch_all_questions_Pitania(card_name):
    try:
        card_name = card_name.strip()
        print(f"Запит на отримання питань для картки: {card_name}")

        conn = sqlite3.connect(Pitania_db_path_questions)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Pitania_questions WHERE Pitania_questions_name = ?', (card_name,))
        questions = cursor.fetchall()
        conn.close()

        questions_data = []
        for question in questions:
            questions_data.append({
                'id': question[0],
                'Pitania_questions_name': question[1],
                'Pitania_question_text': question[2],
                'Pitania_question_correct': question[3]  # Исправлена опечатка
            })
            print(f"Питання: {question}")  # Виведемо питання у консоль

        if not questions_data:
            print(f"No questions found for card '{card_name}'")  # Отладочное сообщение

        return jsonify(questions_data), 200
    except Exception as e:
        print(f"Помилка при отриманні питань: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route('/save_questions_Pitania', methods=['POST'])
def save_questions_Pitania():
    try:
        questions_data = request.get_json()
        if not questions_data:
            print("No questions data provided")
            return jsonify({"message": "No questions data provided"}), 400

        card_name = request.args.get('card_name')
        if not card_name:
            print("No card name provided")
            return jsonify({"message": "No card name provided"}), 400

        card_name = card_name.strip('()').replace("'", "").strip()
        print(f"Отримано питання: {questions_data} для картки: {card_name}")

        conn = sqlite3.connect(Pitania_db_path_questions)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Pitania_questions';")
        if not cursor.fetchone():
            print("Table Pitania_questions does not exist")
            return jsonify({"message": "Table Pitania_questions does not exist"}), 500

        for q in questions_data:
            cursor.execute('''
                INSERT INTO Pitania_questions (Pitania_questions_name, Pitania_question_text, Pitania_question_current)
                VALUES (?, ?, ?)
            ''', (card_name, q['text'], q['correct']))

        conn.commit()
        conn.close()
        print("Питання успішно збережено в базу даних.")

        return jsonify({"message": "Questions saved successfully"}), 200
    except Exception as e:
        print(f"Помилка при збереженні питань: {e}")
        return jsonify({"message": "Internal server error"}), 500


# ------------------------- NEXT DONATE -----------------------------------


@app.route("/Donat")
def Donate():
    form_data = {}
    return render_template("donat.html", form_data=form_data)

@app.route("/donate", methods=["GET", "POST"])
def Donat():
    form_data = request.form if request.method == "POST" else {}

    if request.method == "POST":
        # Отримання даних з форми
        card_number = form_data.get("cc-number")
        donation_amount = form_data.get("cc-expiration")

        # Проста перевірка валідності даних
        if not card_number or not card_number.isdigit() or len(card_number) not in [15, 16]:
            flash("Invalid credit card number. Please try again.", "danger")
        elif not donation_amount or not donation_amount.isdigit() or int(donation_amount) <= 0:
            flash("Invalid donation amount. Please enter a positive number.", "danger")
        else:
            # Логіка успішного донату
            flash(f"Donation successful! Amount: ${donation_amount}", "success")
            return redirect(url_for("Donate"))

    return render_template("donat.html", form_data=form_data)


# ---------------------------- NEXT ABOUT -----------------------------

@app.route('/About')
def about():
    return render_template('about.html')


# ------------------------- NEXT CONTACT US -------------------------

@app.route('/Contact_us')
def contact_us():
    return render_template('contact_us.html')


# ------------------------- NEXT EDIT PROFILE ------------------------------
@app.route('/Edit_profile')
def edit_profile():
    return render_template('edit_profile.html')


@app.route('/Register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        print(f"Отримано дані для реєстрації: username={username}, email={email}, password={password}")

        try:
            # Підключення до бази даних
            conn = sqlite3.connect(user_accounts)
            cursor = conn.cursor()

            # Перевірка існування користувача з тією ж електронною поштою
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            existing_user = cursor.fetchone()
            if existing_user:
                print("Користувач з такою електронною адресою вже існує.")
                flash('Email address already exists. Please use a different one.', 'danger')
                return redirect(url_for('register'))

            # Вставка нових даних користувача
            cursor.execute('''
                INSERT INTO users (username, email, password)
                VALUES (?, ?, ?)
            ''', (username, email, password))

            # Збереження змін
            conn.commit()
            cursor.execute('SELECT * FROM users')
            users = cursor.fetchall()
            print("Усі користувачі після вставки нового запису:")
            for user in users:
                print(user)
            conn.close()
            print("Дані успішно збережені в базу даних.")
            return redirect(url_for('login'))
        except Exception as e:
            print(f"Помилка при збереженні даних: {e}")
            return "There was an issue adding your data to the database."
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        print(f"Отримано дані для входу: email={email}, password={password}")

        try:
            conn = sqlite3.connect(user_accounts)
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
            user = cursor.fetchone()
            conn.close()

            if user:
                session['user_id'] = user[0]
                session['username'] = user[1]
                flash('Login successful!', 'success')
                print("Вхід успішний.")
                return redirect(url_for('account'))
            else:
                flash('Invalid email or password', 'danger')
                print("Невірний email або пароль.")
        except Exception as e:
            print(f"Помилка при вході в систему: {e}")
            return "There was an issue logging you in."

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))

@app.route('/Account')
def account():
    if 'user_id' in session:
        user_id = session['user_id']
        conn = sqlite3.connect(user_accounts)
        cursor = conn.cursor()
        cursor.execute('SELECT username, email, password FROM users WHERE id = ?', (user_id,))
        user = cursor.fetchone()
        conn.close()

        if user:
            user_info = {
                'username': user[0],
                'email': user[1],
                'password': user[2],
            }
            return render_template('account.html', user=user_info)
        else:
            flash('User not found.', 'danger')
            return redirect(url_for('login'))
    else:
        flash('Please log in to view your account details.', 'warning')
        return redirect(url_for('login'))

@app.route('/update-profile', methods=['POST'])
def update_profile():
    if 'user_id' in session:
        user_id = session['user_id']
        conn = sqlite3.connect(user_accounts)
        cursor = conn.cursor()
        try:
            cursor.execute('UPDATE users SET quiz_count = quiz_count + 1 WHERE id = ?', (user_id,))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Profile updated successfully'})
        except Exception as e:
            conn.rollback()
            conn.close()
            print(f'Error updating profile: {e}')  # Логування помилки
            return jsonify({'message': 'Failed to update profile'}), 500
    else:
        return jsonify({'message': 'User not logged in'}), 401

if __name__ == '__main__':
    # Ініціалізуємо бази даних перед запуском сервера
    create_databases()
    app.run(debug=True)
