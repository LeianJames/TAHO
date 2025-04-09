# app.py
from flask import Flask, render_template
from database import db_init
from routes.main import main_bp
from routes.books import books_bp
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nst_library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'nst_library_secret_key'

# Initialize database
db_init(app)

# Register blueprints
app.register_blueprint(main_bp)
app.register_blueprint(books_bp)

# Ensure the uploads directory exists
os.makedirs(os.path.join(app.static_folder, 'images/covers'), exist_ok=True)

if __name__ == '__main__':
    app.run(debug=True)


# database.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def db_init(app):
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        from models import Book, Category
        db.create_all()
        
        # Create categories if they don't exist
        categories = [
            "Academic", "Criminology", "Fiction", "Thesis", 
            "Financial", "Religion", "Self-Growth", "Technology"
        ]
        
        for category_name in categories:
            if not Category.query.filter_by(name=category_name).first():
                new_category = Category(name=category_name)
                db.session.add(new_category)
        
        db.session.commit()


# models.py
from database import db
from datetime import datetime

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    image_path = db.Column(db.String(255))
    books = db.relationship('Book', backref='category', lazy=True)
    
    def __repr__(self):
        return f'<Category {self.name}>'

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    cover_image = db.Column(db.String(255))
    published_date = db.Column(db.String(50))
    isbn = db.Column(db.String(20))
    publisher = db.Column(db.String(100))
    pages = db.Column(db.Integer)
    available = db.Column(db.Boolean, default=True)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Book {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'description': self.description,
            'cover_image': self.cover_image,
            'published_date': self.published_date,
            'isbn': self.isbn,
            'publisher': self.publisher,
            'pages': self.pages,
            'available': self.available,
            'category': self.category.name
        }


# routes/__init__.py
# This file is intentionally left empty to make the directory a Python package


# routes/main.py
from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from models import Category, Book
from database import db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    categories = Category.query.all()
    return render_template('index.html', categories=categories)

@main_bp.route('/search')
def search():
    query = request.args.get('q', '')
    category_id = request.args.get('category', None)
    
    if query:
        # Base query
        book_query = Book.query.filter(
            (Book.title.ilike(f'%{query}%')) |
            (Book.author.ilike(f'%{query}%')) |
            (Book.description.ilike(f'%{query}%'))
        )
        
        # Add category filter if provided
        if category_id and category_id.isdigit():
            book_query = book_query.filter(Book.category_id == int(category_id))
        
        books = book_query.all()
        return jsonify({
            'results': [book.to_dict() for book in books],
            'count': len(books)
        })
    
    return jsonify({'results': [], 'count': 0})


# routes/books.py
from flask import Blueprint, render_template, request, redirect, url_for, jsonify, flash, current_app
from models import Book, Category
from database import db
import os
from werkzeug.utils import secure_filename
import json

books_bp = Blueprint('books', __name__)

@books_bp.route('/category/<string:category_name>')
def category(category_name):
    category = Category.query.filter_by(name=category_name).first_or_404()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    books_pagination = Book.query.filter_by(category_id=category.id).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    total_books = Book.query.filter_by(category_id=category.id).count()
    
    return render_template(
        'category.html',
        category=category,
        books=books_pagination.items,
        pagination=books_pagination,
        total_books=total_books
    )

@books_bp.route('/book/<int:book_id>')
def book_detail(book_id):
    book = Book.query.get_or_404(book_id)
    return render_template('book_detail.html', book=book)

@books_bp.route('/api/books/<string:category_name>')
def api_category_books(category_name):
    category = Category.query.filter_by(name=category_name).first_or_404()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'relevance')
    
    query = Book.query.filter_by(category_id=category.id)
    
    # Sort options
    if sort_by == 'title':
        query = query.order_by(Book.title)
    elif sort_by == 'date':
        query = query.order_by(Book.published_date.desc())
    # Default is relevance (no specific ordering)
    
    books_pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    total_books = query.count()
    
    books_data = [book.to_dict() for book in books_pagination.items]
    
    return jsonify({
        'books': books_data,
        'total': total_books,
        'pages': books_pagination.pages,
        'current_page': page
    })

# Admin routes for managing books - these would typically be protected
@books_bp.route('/admin/books/add', methods=['GET', 'POST'])
def add_book():
    if request.method == 'POST':
        # Handle book creation logic
        pass
    categories = Category.query.all()
    return render_template('admin/add_book.html', categories=categories)