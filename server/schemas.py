from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from models import User, Clinic, Appointment, Article, Image, SymptomHistory
from extensions import db


class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True
        sqla_session = db.session

    id = auto_field()
    full_name = auto_field()
    email = auto_field()
    phone_number = auto_field()
    role = auto_field()
    profile = auto_field()
    clinic_id = auto_field()
    saved_clinics = auto_field()
    blocked = auto_field()
    created_at = auto_field()


class ClinicSchema(SQLAlchemySchema):
    class Meta:
        model = Clinic
        load_instance = True
        sqla_session = db.session

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
    doctors = auto_field()


class AppointmentSchema(SQLAlchemySchema):
    class Meta:
        model = Appointment
        load_instance = True
        sqla_session = db.session

    id = auto_field()


class ArticleSchema(SQLAlchemySchema):
    class Meta:
        model = Article
        load_instance = True
        sqla_session = db.session

    id = auto_field()


class ImageSchema(SQLAlchemySchema):
    class Meta:
        model = Image
        load_instance = True
        sqla_session = db.session

    id = auto_field()


class SymptomSchema(SQLAlchemySchema):
    class Meta:
        model = SymptomHistory
        load_instance = True
        sqla_session = db.session

    id = auto_field()
