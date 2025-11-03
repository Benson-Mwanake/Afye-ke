# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from extensions import db
from models import User, Role, Clinic
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from schemas import UserSchema  # Import UserSchema

bp = Blueprint("auth", __name__, url_prefix="/auth")
user_schema = UserSchema()  # Initialize UserSchema


# REGISTER USER
@bp.route("/register", methods=["POST"])
@cross_origin()
def register():
    data = request.get_json()
    full_name = data.get("full_name")
    email = data.get("email")
    phone_number = data.get("phone_number") or data.get("phoneNumber")
    password = data.get("password")
    role = data.get("role", Role.PATIENT)

    if not all([full_name, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = generate_password_hash(password)
    user = User(
        full_name=full_name,
        email=email,
        phone_number=phone_number,
        password_hash=hashed_password,
        role=role,
    )

    if role == Role.CLINIC:
        clinic_name = data.get("clinic_name") or full_name
        clinic = Clinic(
            name=clinic_name,
            location=data.get("location", ""),
            phone=data.get("phone", phone_number or ""),
            email=email,
            password=password,
        )
        db.session.add(clinic)
        db.session.flush()
        user.clinic_id = clinic.id

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
        expires_delta=timedelta(days=1),
    )

    return (
        jsonify(
            {
                "msg": "User registered successfully",
                "access_token": access_token,
                "user": user_schema.dump(user),  # Use UserSchema for consistency
            }
        ),
        201,
    )


# LOGIN USER
@bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    if user.role == Role.CLINIC and not user.clinic_id:
        return jsonify({"error": "Clinic not found. Please log in as a clinic."}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
        expires_delta=timedelta(days=1),
    )

    return (
        jsonify(
            {
                "msg": "Login successful",
                "access_token": access_token,
                "user": user_schema.dump(user),  # Use UserSchema for consistency
            }
        ),
        200,
    )


# PROFILE
@bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user_id = current_user["id"] if isinstance(current_user, dict) else current_user
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user_schema.dump(user)), 200
