from datetime import datetime
from extensions import db
from sqlalchemy.dialects.postgresql import JSONB
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class Role:
    ADMIN = "admin"
    MANAGER = "manager"
    CLINIC = "clinic"
    PATIENT = "patient"


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(50))
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default=Role.PATIENT)
    profile = db.Column(JSONB, default={})
    clinic_id = db.Column(db.Integer, nullable=True)
    saved_clinics = db.Column(JSONB, default=[])
    blocked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Clinic(db.Model):
    __tablename__ = "clinics"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255))
    coordinates = db.Column(JSONB)
    services = db.Column(JSONB)
    rating = db.Column(db.Float)
    reviews = db.Column(db.Integer)
    phone = db.Column(db.String(50))
    email = db.Column(db.String(120))
    operating_hours = db.Column(JSONB)
    verified = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(50))
    doctors = db.Column(JSONB)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    images = db.relationship("Image", backref="clinic", lazy="select")
    password = db.Column(db.String(200))
    opening_time = db.Column(db.String, nullable=True)
    closing_time = db.Column(db.String, nullable=True)
  # hashed password ideally


class Appointment(db.Model):
    __tablename__ = "appointments"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    patient_id = db.Column(db.Integer, nullable=False)
    clinic_id = db.Column(db.Integer, nullable=False)
    clinic_name = db.Column(db.String(255))
    doctor = db.Column(db.String(255))
    service = db.Column(db.String(255))
    date = db.Column(db.String(50))
    time = db.Column(db.String(50))
    status = db.Column(db.String(50))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(500))
    category = db.Column(db.String(200))
    author = db.Column(db.String(200))
    date = db.Column(db.String(50))
    read_time = db.Column(db.String(50))
    image = db.Column(db.String(500))
    summary = db.Column(db.Text)
    content = db.Column(db.Text)
    published = db.Column(db.Boolean, default=True)
    is_trending = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Image(db.Model):
    __tablename__ = "images"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    public_id = db.Column(db.String(255))
    url = db.Column(db.String(500))
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)
    clinic_id = db.Column(db.Integer, db.ForeignKey("clinics.id"), nullable=True)
    uploaded_by = db.Column(db.Integer, nullable=True)
    meta_data = db.Column(JSONB)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class SymptomHistory(db.Model):
    __tablename__ = "symptom_history"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    symptoms = db.Column(db.Text)
    result = db.Column(JSONB)
    timestamp = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    __tablename__ = "reviews"
    id = db.Column(db.Integer, primary_key=True)
    clinic_id = db.Column(db.Integer, db.ForeignKey("clinics.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


from extensions import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(80))
    summary = db.Column(db.Text)
    content = db.Column(db.Text)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="Pending")

    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    clinic_id = db.Column(db.Integer, db.ForeignKey('clinics.id'), nullable=True)

    # Relationships
    user = db.relationship("User", backref="reports", lazy=True)
    clinic = db.relationship("Clinic", backref="reports", lazy=True)

    def __repr__(self):
        return f"<Report {self.title}>"

    

    