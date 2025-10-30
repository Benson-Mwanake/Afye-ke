from flask import Blueprint, request
from flask_restful import Api, Resource
from extensions import db
from models import User, Role
from flask_jwt_extended import create_access_token

bp = Blueprint("auth", __name__)
api = Api(bp)


def user_public(user):
    return {
        "id": user.id,
        "fullName": user.full_name,
        "email": user.email,
        "phoneNumber": user.phone_number,
        "role": user.role,
        "clinicId": user.clinic_id,
        "profile": user.profile or {},
        "savedClinics": user.saved_clinics or [],
    }


class Register(Resource):
    def post(self):
        data = request.get_json() or {}
        email = data.get("email")
        if not email or not data.get("password"):
            return {"msg": "email and password required"}, 400
        if User.query.filter_by(email=email).first():
            return {"msg": "email exists"}, 400

        user = User(
            full_name=data.get("fullName", ""),
            email=email,
            phone_number=data.get("phoneNumber"),
            role=data.get("role", Role.PATIENT),
            profile=data.get("profile", {}),
            saved_clinics=data.get("savedClinics", []),
        )
        user.set_password(data.get("password"))
        db.session.add(user)
        db.session.commit()

        token = create_access_token(
            identity=user.id, additional_claims={"role": user.role}
        )
        return {"access_token": token, "user": user_public(user)}, 201


class Login(Resource):
    def post(self):
        data = request.get_json() or {}
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return {"msg": "missing credentials"}, 400
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"msg": "bad credentials"}, 401
        token = create_access_token(
            identity=user.id, additional_claims={"role": user.role}
        )
        return {"access_token": token, "user": user_public(user)}, 200


api.add_resource(Register, "/register")
api.add_resource(Login, "/login")
