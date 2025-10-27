from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

user_saved_clinics = db.Table(
    "user_saved_clinics",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("clinic_id", db.Integer, db.ForeignKey("clinics.id"), primary_key=True),
)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(30), default="user")  # admin, clinic, user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    saved_clinics = db.relationship("Clinic", secondary=user_saved_clinics, back_populates="saved_by_users")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Clinic(db.Model):
    __tablename__ = "clinics"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    county = db.Column(db.String(100))
    address = db.Column(db.String(300))
    phone = db.Column(db.String(50))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    services = db.Column(db.Text)  # comma-separated or JSON text
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship("Booking", back_populates="clinic", cascade="all, delete-orphan")
    saved_by_users = db.relationship("User", secondary=user_saved_clinics, back_populates="saved_clinics")
    chvs = db.relationship("CHV", back_populates="clinic")

class Booking(db.Model):
    __tablename__ = "bookings"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    clinic_id = db.Column(db.Integer, db.ForeignKey("clinics.id"), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default="pending")  # pending, confirmed, cancelled, done
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="bookings")
    clinic = db.relationship("Clinic", back_populates="bookings")

class CHV(db.Model):
    __tablename__ = "chvs"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50))
    county = db.Column(db.String(100))
    clinic_id = db.Column(db.Integer, db.ForeignKey("clinics.id"), nullable=True)
    bio = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    clinic = db.relationship("Clinic", back_populates="chvs")

class Article(db.Model):
    __tablename__ = "articles"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    slug = db.Column(db.String(300), unique=True, nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
