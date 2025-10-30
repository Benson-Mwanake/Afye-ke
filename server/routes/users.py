from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User
from schemas import UserSchema

bp = Blueprint("users", __name__, url_prefix="/users")
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@bp.route("/", methods=["GET"])
@jwt_required()
def list_users():
    identity = get_jwt_identity()
    # ensure we get the ID from dict if JWT stores object
    user_id = identity["id"] if isinstance(identity, dict) else identity
    current = User.query.get(user_id)
    if not current:
        return jsonify({"msg": "User not found"}), 404
    if current.role not in ["admin", "manager"]:
        return jsonify({"msg": "Not authorized"}), 403
    users = User.query.all()
    return jsonify(users_schema.dump(users))


@bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    identity = get_jwt_identity()
    user_id_jwt = identity["id"] if isinstance(identity, dict) else identity
    current = User.query.get(user_id_jwt)
    if not current:
        return jsonify({"msg": "User not found"}), 404
    if current.role not in ["admin", "manager"] and current.id != user_id:
        return jsonify({"msg": "Not authorized"}), 403
    user = User.query.get_or_404(user_id)
    return jsonify(user_schema.dump(user))


@bp.route("/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_user(user_id):
    identity = get_jwt_identity()
    user_id_jwt = identity["id"] if isinstance(identity, dict) else identity
    current = User.query.get(user_id_jwt)
    if not current:
        return jsonify({"msg": "User not found"}), 404

    if current.role != "admin" and current.id != user_id:
        return jsonify({"msg": "Not authorized"}), 403

    payload = request.get_json() or {}
    user = User.query.get_or_404(user_id)

    if "savedClinics" in payload:
        user.saved_clinics = payload["savedClinics"]
    if "profile" in payload:
        user.profile = payload["profile"]
    if "phoneNumber" in payload:
        user.phone_number = payload["phoneNumber"]
    if "fullName" in payload:
        user.full_name = payload["fullName"]

    db.session.commit()
    return jsonify(user_schema.dump(user))
