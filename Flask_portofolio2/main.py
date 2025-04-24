from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import sqlite3
import os
import csv
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
logging.basicConfig(level=logging.DEBUG)
import smtplib

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Налаштування баз даних
basedir = os.path.abspath(os.path.dirname(__file__))
contact_db_path = os.path.join(basedir, 'contact.db')

def create_contact_db():
    conn = sqlite3.connect(contact_db_path)
    cursor = conn.cursor()
    cursor.execute(''' 
                CREATE TABLE IF NOT EXISTS contact (
                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                   name TEXT NOT NULL,
                   email TEXT NOT NULL,
                   theme TEXT NOT NULL,
                   message TEXT NOT NULL
                   ) ''')
    conn.commit()
    conn.close()

create_contact_db()

@app.route('/')
@app.route('/Home')
def home():
    return render_template('home.html')

@app.route('/AboutMe')
def about_me():
    return render_template('about_me.html')

@app.route('/Portofolio')
def portofolio():
    return render_template('portofolio.html')

@app.route('/Services')
def services():
    return render_template('services.html')

@app.route('/Reviews')
def reviews():
    return render_template('reviews.html')

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Дані SMTP-сервера
SMTP_SERVER = "smtp.gmail.com"  # Для Gmail
SMTP_PORT = 587
EMAIL_SENDER = "simkivmaksim4@gmail.com"  # Вкажи свою пошту
EMAIL_PASSWORD = "ybqa xwec yids gkin"  # Використай пароль додатка (не звичайний пароль)

def send_email(email, name, theme, message):
    try:
        # Формування листа
        msg = MIMEMultipart()
        msg["From"] = EMAIL_SENDER
        msg["To"] = email
        msg["Subject"] = theme

        body = f"Тобі прийшло повідомлення від {name}! \nМоя електронна адресса: {email} \nТема за якою я звернувся: {theme} \n Повідомлення:\n{message}."
        msg.attach(MIMEText(body, "plain"))

        # Підключення до SMTP-сервера та відправка
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, email, msg.as_string())
        server.quit()

        print(f"Email успішно відправлено {email}")
    except Exception as e:
        print(f"Помилка відправки email: {e}")



@app.route('/Contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        theme = request.form.get('theme')
        message = request.form.get('message')
        
        if not name or not email or not theme or not message:
            return "Помилка: Заповніть усі поля!"
        
        # Запис у базу
        try:
            conn = sqlite3.connect(contact_db_path)
            cursor = conn.cursor()
            cursor.execute(
                'INSERT INTO contact (name, email, theme, message) VALUES (?, ?, ?, ?)',
                (name, email, theme, message)
            )
            conn.commit()
            conn.close()
        except Exception as e:
            return f"Помилка запису до БД: {e}"
        
        # Відправлення email
        send_email(email, name, theme, message)
        
        return "Дякуємо! Ваше повідомлення отримано."
    
    return render_template('contact.html')
send_email("test@example.com", "Ім'я", "Тестова тема", "Тестове повідомлення")

if __name__ == '__main__':
    app.run(debug=True)
