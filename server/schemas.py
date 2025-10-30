from extensions import ma
from marshmallow import fields
from models import User, Clinic, Article, Appointment, Image, SymptomHistory

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        load_instance = True

    id = ma.auto_field()
    fullName = fields.String(attribute="full_name", data_key="fullName")
    email = ma.auto_field()
    phoneNumber = fields.String(attribute="phone_number", data_key="phoneNumber")
    role = ma.auto_field()
    clinicId = fields.Integer(attribute="clinic_id", data_key="clinicId", allow_none=True)
    profile = fields.Raw()
    savedClinics = fields.Raw(attribute="saved_clinics", data_key="savedClinics")
    blocked = ma.auto_field()
    createdAt = fields.DateTime(attribute="created_at", data_key="createdAt")

class ClinicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Clinic
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    location = ma.auto_field()
    coordinates = ma.auto_field()
    services = ma.auto_field()
    rating = ma.auto_field()
    reviews = ma.auto_field()
    phone = ma.auto_field()
    email = ma.auto_field()
    operatingHours = fields.Raw(attribute="operating_hours", data_key="operatingHours")
    verified = ma.auto_field()
    status = ma.auto_field()
    doctors = ma.auto_field()
    createdAt = fields.DateTime(attribute="created_at", data_key="createdAt")

class ArticleSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Article
        load_instance = True

    id = ma.auto_field()
    title = ma.auto_field()
    category = ma.auto_field()
    author = ma.auto_field()
    date = ma.auto_field()
    readTime = fields.String(attribute="read_time", data_key="readTime")
    image = ma.auto_field()
    summary = ma.auto_field()
    content = ma.auto_field()
    published = ma.auto_field()
    isTrending = fields.Boolean(attribute="is_trending", data_key="isTrending")
    createdAt = fields.DateTime(attribute="created_at", data_key="createdAt")

class AppointmentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Appointment
        load_instance = True

    id = ma.auto_field()
    patientId = fields.Integer(attribute="patient_id", data_key="patientId")
    clinicId = fields.Integer(attribute="clinic_id", data_key="clinicId")
    clinicName = fields.String(attribute="clinic_name", data_key="clinicName")
    doctor = ma.auto_field()
    service = ma.auto_field()
    date = ma.auto_field()
    time = ma.auto_field()
    status = ma.auto_field()
    notes = ma.auto_field()
    createdAt = fields.DateTime(attribute="created_at", data_key="createdAt")

class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True

class SymptomHistorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SymptomHistory
        load_instance = True
