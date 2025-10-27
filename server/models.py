from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dob = db.Column(db.String(20))
    gender = db.Column(db.String(20))
    country = db.Column(db.String(50))
    blood_type = db.Column(db.String(5))
    allergies = db.Column(db.String(255))
    emergency_contact = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(20))
    password_hash = db.Column(db.String(512))
    role = db.Column(db.String(20), nullable=False)  # patient, clinic, admin
    clinic_id = db.Column(db.String, nullable=True)
    profile = db.relationship("Profile", backref="user", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Clinic(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100))
    location = db.Column(db.String(255))
    coordinates = db.Column(db.PickleType)  # list: [lat, long]
    services = db.Column(db.PickleType)
    rating = db.Column(db.Float, default=0)
    reviews = db.Column(db.Integer, default=0)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    operating_hours = db.Column(db.String(50))
    verified = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default="pending")

class Booking(db.Model):
    id = db.Column(db.String, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    clinic_id = db.Column(db.String, db.ForeignKey("clinic.id"))
    clinic_name = db.Column(db.String(100))
    doctor = db.Column(db.String(100))
    service = db.Column(db.String(100))
    date = db.Column(db.String(20))
    time = db.Column(db.String(10))
    status = db.Column(db.String(20), default="Pending")
    notes = db.Column(db.String(255))


class CHV(db.Model):
    id = db.Column(db.String, primary_key=True)
    full_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    assigned_patients = db.Column(db.PickleType)  # list of patient IDs

class Article(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255))
    category = db.Column(db.String(50))
    author = db.Column(db.String(100))
    date = db.Column(db.String(20))
    read_time = db.Column(db.String(20))
    image = db.Column(db.String(255))
    summary = db.Column(db.String(255))
    content = db.Column(db.Text)
    published = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
