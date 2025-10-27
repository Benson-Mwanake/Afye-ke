from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from schemas import UserSchema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint("auth", __name__, url_prefix="/api/auth")
user_schema = UserSchema(session=db.session)

@bp.route("/register", methods=["POST"])
def register():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400

    # validate
    try:
        data = user_schema.load(json_data)
    except Exception as e:
        return jsonify({"msg": "Validation error", "errors": e.messages}), 400

    if User.query.filter_by(email=data.email).first():
        return jsonify({"msg": "Email already registered"}), 400

    # create user
    user = User(full_name=data.full_name, email=data.email)
    user.set_password(json_data["password"])
    db.session.add(user)
    db.session.commit()

    # create JWT token
    access_token = create_access_token(identity=user.id)

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
    if not user or not user.check_password(json_data["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)

    return jsonify({
        "msg": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }
    }), 200


@bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({"msg":"User not found"}), 404
    return jsonify(user_schema.dump(user))
