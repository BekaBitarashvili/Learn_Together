from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = 'გთხოვთ გაიაროთ ავტორიზაცია ამ გვერდზე წვდომისთვის.'


# User Model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Create tables
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/courses')
def courses():
    return render_template('courses.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/faq')
def faq():
    return render_template('faq.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        # Validation
        if not username or not email or not password:
            flash('ყველა ველი სავალდებულოა!', 'error')
            return render_template('register.html')

        if password != confirm_password:
            flash('პაროლები არ ემთხვევა!', 'error')
            return render_template('register.html')

        if len(password) < 6:
            flash('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს!', 'error')
            return render_template('register.html')

        # Check if user exists
        if User.query.filter_by(username=username).first():
            flash('მომხმარებელი ამ სახელით უკვე არსებობს!', 'error')
            return render_template('register.html')

        if User.query.filter_by(email=email).first():
            flash('ეს ელ-ფოსტა უკვე გამოყენებულია!', 'error')
            return render_template('register.html')

        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash('რეგისტრაცია წარმატებით დასრულდა! გთხოვთ გაიაროთ ავტორიზაცია.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        remember = request.form.get('remember', False)

        if not username or not password:
            flash('გთხოვთ შეავსოთ ყველა ველი!', 'error')
            return render_template('login.html')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user, remember=remember)
            next_page = request.args.get('next')
            flash(f'მოგესალმებით, {user.username}!', 'success')
            return redirect(next_page if next_page else url_for('index'))
        else:
            flash('არასწორი მომხმარებლის სახელი ან პაროლი!', 'error')

    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('თქვენ წარმატებით გამოხვედით სისტემიდან.', 'success')
    return redirect(url_for('index'))


@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')


if __name__ == '__main__':
    app.run(debug=True)