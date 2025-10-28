from flask import Blueprint, request, jsonify
from extensions import db
from models import User, Profile
from schemas import UserSchema
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint("auth", __name__, url_prefix="/api/auth")
user_schema = UserSchema()

@bp.route("/register", methods=["POST"])
def register():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400

    # validate input
    try:
        data = user_schema.load(json_data)
    except Exception as e:
        return jsonify({"msg": "Validation error", "errors": getattr(e, 'messages', str(e))}), 400

    # check if email exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already registered"}), 400

    # create user
    user = User(
        full_name=data.get("fullName"),
        email=data.get("email"),
        phone_number=data.get("phoneNumber"),
        role=data.get("role")
    )
    user.password_hash = generate_password_hash(data["password"])

    # create profile
    profile_data = data.get("profile", {})
    profile = Profile(
        dob=profile_data.get("dob"),
        gender=profile_data.get("gender"),
        country=profile_data.get("country"),
        blood_type=profile_data.get("bloodType"),
        allergies=profile_data.get("allergies"),
        emergency_contact=profile_data.get("emergencyContact"),
        user=user
    )

    db.session.add(user)
    db.session.add(profile)
    db.session.commit()

    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})


    return jsonify({
        "msg": "User created",
        "access_token": access_token,
        "user": user_schema.dump(user)
    }), 201


@bp.route("/login", methods=["POST"])
def login():
    json_data = request.get_json()
    if not json_data or not json_data.get("email") or not json_data.get("password"):
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=json_data["email"]).first()
    if not user or not check_password_hash(user.password_hash, json_data["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})


    return jsonify({
        "msg": "Login successful",
        "access_token": access_token,
        "user": user_schema.dump(user)
    }), 200


@bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user_schema.dump(user))
