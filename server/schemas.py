from extensions import ma
from marshmallow import fields
from models import User, Clinic, Article, Appointment, Image, SymptomHistory

# ------------------------
# User Schema
# ------------------------
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

# ------------------------
# Clinic Schema
# ------------------------
class ClinicSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Clinic
        include_fk = True
        load_instance = True

    id = ma.auto_field()
    name = ma.auto_field()
    location = ma.auto_field()
    coordinates = ma.auto_field()
    services = ma.List(ma.String())
    rating = ma.auto_field()
    reviews = ma.auto_field()
    phone = ma.auto_field()
    email = ma.auto_field()
    operatingHours = ma.List(ma.Dict())
    verified = ma.auto_field()
    status = ma.auto_field()
    doctors = ma.List(ma.String())
    createdAt = fields.DateTime(attribute="created_at", data_key="createdAt")

# ------------------------
# Article Schema
# ------------------------
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

# ------------------------
# Appointment Schema
# ------------------------
class AppointmentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Appointment
        load_instance = True

    id = ma.auto_field()
    patientId = fields.Integer(attribute="patient_id", data_key="patientId")
    patientName = fields.Method("get_patient_name", data_key="patientName")
    
    clinicId = fields.Integer(attribute="clinic_id", data_key="clinicId")
    clinicName = fields.String(attribute="clinic_name", data_key="clinicName")
    doctor = ma.auto_field()
    service = ma.auto_field()
    date = ma.auto_field()
    time = ma.auto_field()
    status = ma.auto_field()
    notes = ma.auto_field()
    createdAt = fields.DateTime(attribute="created_at", data_key="createdAt")

    def get_patient_name(self, obj):
        # Fetch full name from related User object
        user = User.query.get(obj.patient_id)
        return user.full_name if user else "Unknown"

# ------------------------
# Image Schema
# ------------------------
class ImageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Image
        load_instance = True

# ------------------------
# Symptom History Schema
# ------------------------
class SymptomHistorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = SymptomHistory
        load_instance = True
