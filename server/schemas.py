from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from models import User, Profile, Clinic, Booking, CHV, Article

class ProfileSchema(SQLAlchemySchema):
    class Meta:
        model = Profile
        load_instance = True

    dob = auto_field()
    gender = auto_field()
    country = auto_field()
    blood_type = auto_field()
    allergies = auto_field()
    emergency_contact = auto_field()

class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    id = auto_field()
    full_name = auto_field()
    email = auto_field()
    phone_number = auto_field()
    role = auto_field()
    clinic_id = auto_field()
    password = fields.String(load_only=True)
    profile = fields.Nested(ProfileSchema)

class ClinicSchema(SQLAlchemySchema):
    class Meta:
        model = Clinic
        load_instance = True

    id = auto_field()
    name = auto_field()
    location = auto_field()
    coordinates = auto_field()
    services = auto_field()
    rating = auto_field()
    reviews = auto_field()
    phone = auto_field()
    email = auto_field()
    operating_hours = auto_field()
    verified = auto_field()
    status = auto_field()

class BookingSchema(SQLAlchemySchema):
    class Meta:
        model = Booking
        load_instance = True

    id = auto_field()
    patient_id = auto_field()
    clinic_id = auto_field()
    clinic_name = auto_field()
    doctor = auto_field()
    service = auto_field()
    date = auto_field()
    time = auto_field()
    status = auto_field()
    notes = auto_field()

class CHVSchema(SQLAlchemySchema):
    class Meta:
        model = CHV
        load_instance = True

    id = auto_field()
    full_name = auto_field()
    phone_number = auto_field()
    assigned_patients = auto_field()

class ArticleSchema(SQLAlchemySchema):
    class Meta:
        model = Article
        load_instance = True

    id = auto_field()
    title = auto_field()
    category = auto_field()
    author = auto_field()
    date = auto_field()
    read_time = auto_field()
    image = auto_field()
    summary = auto_field()
    content = auto_field()
    published = auto_field()
    created_at = auto_field()
