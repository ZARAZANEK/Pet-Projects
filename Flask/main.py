from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import sqlite3
import os
import csv
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'


# Визначення шляхів до файлів баз даних
users_path = 'user_accounts.db'
orders_path = 'orders.db'
contact_path = 'contact.db'
UPLOAD_FOLDER = 'static/profile_pics'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Функція для створення бази даних користувачів
def create_user_database():
    try:
        with sqlite3.connect(users_path) as conn:
            cursor = conn.cursor()
            cursor.execute(''' 
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    bio TEXT,
                    phone TEXT,
                    address TEXT,
                    profile_picture TEXT
                ) 
            ''')
            conn.commit()
            print("User database created successfully.")
    except sqlite3.Error as e:
        print(f"Error creating users table: {e}")

# Функція для створення бази даних замовлень
def create_orders_database():
    try:
        with sqlite3.connect(orders_path) as conn:
            cursor = conn.cursor()
            cursor.execute(''' 
                CREATE TABLE IF NOT EXISTS orders (
                    order_number INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL, 
                    email TEXT NOT NULL,
                    start_geo TEXT NOT NULL,
                    final_geo TEXT NOT NULL,
                    message TEXT,
                    car_type TEXT NOT NULL,
                    car_year INTEGER NOT NULL,
                    car_mark TEXT NOT NULL,
                    car_model TEXT NOT NULL,
                    date_order TEXT NOT NULL,
                    order_count INTEGER DEFAULT 0
                ) 
            ''')
            conn.commit()
            print("Orders database created successfully.")
    except sqlite3.Error as e:
        print(f"Error creating orders table: {e}")

#створення таблиці для прийняття та запису звертань
def create_contact_database():
    try:
        with sqlite3.connect(contact_path) as conn:
            cursor = conn.cursor()
            cursor.execute(''' 
                CREATE TABLE IF NOT EXISTS contact (
                    contact_number INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    subject TEXT NOT NULL,
                    message TEXT NOT NULL
                    ) 
                ''')
            conn.commit()
            print("Contact database has been created")
    except sqlite3.Error as e:
        print(f'Error creating contacts table: {e}')

# Виклик функцій для створення баз даних
create_user_database()
create_orders_database()
create_contact_database()

def add_order_count_column():
    try:
        with sqlite3.connect(users_path) as conn:
            cursor = conn.cursor()
            # Додаємо колонку order_count, якщо її немає
            cursor.execute('ALTER TABLE users ADD COLUMN order_count INTEGER DEFAULT 0')
            conn.commit()
            print("Column order_count added successfully.")
    except sqlite3.Error as e:
        print(f"Error adding order_count column: {e}")

# З'єднання з базою даних
def get_db_connection(db_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn
#Створення початкової сторінки / i main
@app.route('/')
@app.route('/main')
def main():
    images = [url_for('static', filename=f'image/img{i}.jpg') for i in [29, 27, 22, 30]]
    return render_template('main.html', images=images)

# Створення сторінки для реєстрування акаунту
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username, email, password = request.form['username'], request.form['email'], request.form['password']
        hashed_password = generate_password_hash(password)

        with get_db_connection(users_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                flash('Ця електронна адреса зайнята')
                return render_template("register.html")

            cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                           (username, email, hashed_password))
            conn.commit()
        return redirect(url_for('login'))
    return render_template("register.html")

# Створення сторінки для входу на акаунт
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        try:
            with get_db_connection(users_path) as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
                user = cursor.fetchone()

            if user and check_password_hash(user['password'], password):  # Перевірка пароля користувача
                session['user_id'] = user['id']  # Збереження id користувача в сесії
                session['username'] = user['username']
                session['email'] = user['email']
                session['bio'] = user['bio']  # Збереження біографії користувача
                session['phone'] = user['phone']  # Збереження номера телефону користувача
                session['address'] = user['address']  # Збереження адреси користувача
                session['profile_picture'] = user['profile_picture']  # Збереження профілю користувача
                return redirect(url_for('account'))
            else:
                flash("Невірні облікові дані. Спробуйте ще раз.", 'danger')
        except sqlite3.Error as e:
            flash(f"Database error: {e}", 'danger')
    return render_template("login.html")
#Створення функції для того щоб вийти з акаунту
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main'))

#Створення сторінки для замовлення
@app.route('/Order', methods=['GET', 'POST'])
def order():
    return render_template('order.html')

@app.route('/save_order', methods=['POST'])
def save_order():     
    if 'email' not in session:
        return jsonify({"message": "User not logged in"}), 403

    email = session.get('email')
    try:
        new_order_data = request.get_json()
        if not new_order_data:
            return jsonify({"message": "No order data provided"}), 400

        print(f"Received a new order: {new_order_data}")

        # Insert the new order into the database
        with sqlite3.connect(orders_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO orders 
                (name, email, start_geo, final_geo, message, car_type, car_year, car_mark, car_model, date_order)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                new_order_data.get('name'), 
                new_order_data.get('email'), 
                new_order_data.get('start_geo'), 
                new_order_data.get('final_geo'),
                new_order_data.get('message'), 
                new_order_data.get('car_type'), 
                new_order_data.get('car_year'), 
                new_order_data.get('car_mark'),
                new_order_data.get('car_model'), 
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            ))
            conn.commit()
            print("Order successfully saved to the database.")

        # Update user order count if email matches
        if new_order_data.get('email') == email:
            with sqlite3.connect(users_path) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE users 
                    SET order_count = COALESCE(order_count, 0) + 1 
                    WHERE email = ?
                ''', (email,))
                conn.commit()
                session['order_count'] = session.get('order_count', 0) + 1
                print("Order count updated in the database and session.")

        # Update rank based on order count
        order_count = session.get('order_count', 0)
        if 0 <= order_count <= 5:
            session['rank'] = 'Початківець-водій'
        elif 6 <= order_count <= 15:
            session['rank'] = 'Любитель швидкості'
        elif 16 <= order_count <= 29:
            session['rank'] = 'Майстер траси'
        elif 30 <= order_count <= 49:
            session['rank'] = 'Гоночний чемпіон'
        elif order_count >= 50:
            session['rank'] = 'Легенда доріг' 
        print(f"Updated rank: {session['rank']}")

        return jsonify({"message": "Order saved successfully"}), 200

    except Exception as e:
        error_message = f"Error saving order: {e}"
        print(error_message)
        return jsonify({"message": error_message}), 500


#Створення сторінки контакти з нами і також функції яка зберігає звернення у базу данних
@app.route('/contact_us', methods=['GET', 'POST'])
def contact_us():
    try:
        if request.method == 'POST':
            name = request.form['name']
            email = request.form['email']
            subject = request.form['subject']
            message = request.form['message']  
            with sqlite3.connect(contact_path) as conn:
                cursor = conn.cursor()
                cursor.execute(''' 
                    INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)''',
                    (name, email, subject, message)) 
                conn.commit()
                print('Заявку успішно поданно!')  
                
        return render_template("Contact_us.html")
    except Exception as e:
        print(f'Помилка при надданні заявки до бази даних: {e}')
        return jsonify({"message": "Internal server error"}), 500

#Створення сторінки про нас
@app.route('/about')
def about():
    return render_template("about.html")

#Створення сторінки з деталями про доставку та інш
@app.route('/details')
def details():
    return render_template("details.html")

# Функція для збереження змін профілю
@app.route('/save_changes_profile', methods=['POST'])
def save_changes_profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    new_username = request.form.get('new_username')
    new_email = request.form.get('new_email')
    bio = request.form.get('bio')
    new_password = request.form.get('new_password')
    phone = request.form.get('phone')
    address = request.form.get('address')
    profile_picture = request.files.get('profile_picture')

    try:
        with get_db_connection(users_path) as conn:
            cursor = conn.cursor()
            
            # Перевіряємо, чи електронна адреса вже існує в базі даних для іншого користувача
            cursor.execute('SELECT id FROM users WHERE email = ? AND id != ?', (new_email, user_id))
            existing_user = cursor.fetchone()
            if existing_user:
                flash('Ця електронна адреса вже використовується іншим користувачем.', 'danger')
                return redirect(url_for('edit_profile'))
                
            if new_password:
                hashed_password = generate_password_hash(new_password)
                cursor.execute('''UPDATE users SET username=?, email=?, bio=?, password=?, phone=?, address=? WHERE id=?''', 
                               (new_username, new_email, bio, hashed_password, phone, address, user_id))
            else:
                cursor.execute('''UPDATE users SET username=?, email=?, bio=?, phone=?, address=? WHERE id=?''', 
                               (new_username, new_email, bio, phone, address, user_id))
            
            if profile_picture:
                filename = f"profile_{user_id}.png"
                profile_picture.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                cursor.execute('''UPDATE users SET profile_picture=? WHERE id=?''', (filename, user_id))
                session['profile_picture'] = filename
            
            conn.commit()

            # Оновлення сесійних даних
            session['username'] = new_username
            session['email'] = new_email
            session['bio'] = bio
            session['phone'] = phone
            session['address'] = address

            flash("Профіль успішно оновлено", 'success')
    except sqlite3.Error as e:
        flash(f"Database error: {e}", 'danger')
    
    return redirect(url_for('account'))

# Створення сторінки акаунту
@app.route('/Account')
def account():
    return render_template('account.html')

@app.route('/order_history')
def order_history():
    if 'email' in session:
        orders = load_orders(session['email'])
        return render_template("History_order.html", order_history=orders)
    flash("Будь ласка, увійдіть для перегляду історії замовлень.")
    return render_template("login.html")

# Функція для завантаження замовлень користувача
def load_orders(email):
    try:
        with get_db_connection(orders_path) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM orders WHERE email = ?', (email,))
            orders = cursor.fetchall()
            return orders
    except sqlite3.Error as e:
        print(f"Error loading orders: {e}")
        return None

# Створення сторінки для редагування акаунту
@app.route('/Edit_profile')
def edit_profile():
    return render_template('edit_profile.html')

@app.route('/Consultation')
def consultation():
    return render_template('consultation.html')

if __name__ == '__main__':
    create_user_database()
    add_order_count_column()
    app.run(debug=True)