from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields
from models import User, Profile, Clinic, Booking, CHV, Article
from marshmallow import Schema, fields
from extensions import db

from marshmallow import Schema, fields

class ProfileSchema(Schema):
    dob = fields.String()
    gender = fields.String()
    country = fields.String()
    blood_type = fields.String(data_key="bloodType")
    allergies = fields.String()
    emergency_contact = fields.String(data_key="emergencyContact")

class UserSchema(Schema):
    id = fields.String(dump_only=True)
    fullName = fields.String(required=True)
    email = fields.Email(required=True)
    phoneNumber = fields.String(required=True)
    role = fields.String(required=True)
    password = fields.String(load_only=True, required=True)
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

    id = fields.Int(dump_only=True)             # Auto-generated ID
    patient_id = fields.Int(dump_only=True)     # Comes from logged-in user
    clinic_id = fields.Int(required=True)       # Clinic to book
    clinic_name = fields.Str(required=True)    # Optional display info
    doctor = fields.Str(required=False)
    service = fields.Str(required=False)
    date = fields.Str(required=False)
    time = fields.Str(required=False)
    status = fields.Str(dump_only=True)
    notes = fields.Str(required=False)


class CHVSchema(SQLAlchemySchema):
    class Meta:
        model = CHV
        load_instance = True
        sqla_session = db.session

    id = auto_field()
    full_name = auto_field()
    phone_number = auto_field()
    assigned_patients = fields.List(fields.String())


class ArticleSchema(SQLAlchemySchema):
    class Meta:
        model = Article
        load_instance = True

    id =  fields.String(dump_only=True)
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
