from marshmallow import Schema, fields, validate, ValidationError, validates
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import User, Clinic, Booking, CHV, Article

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        exclude = ("password_hash",)

    password = fields.String(load_only=True, required=True, validate=validate.Length(min=6))

    @validates("email")
    def validate_email(self, value):
        if "@" not in value:
            raise ValidationError("Invalid email address")

class ClinicSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Clinic
        load_instance = True
        include_fk = True

class BookingSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        load_instance = True
        include_fk = True
        # exclude user_id because we set it from JWT in the route
        exclude = ("user_id",)

    appointment_time = fields.DateTime(required=True)
    status = fields.String(validate=validate.OneOf(["pending","confirmed","cancelled","done"]))


class CHVSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = CHV
        load_instance = True

class ArticleSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Article
        load_instance = True
