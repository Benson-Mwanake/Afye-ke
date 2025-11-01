from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Appointment
from schemas import UserSchema

bp = Blueprint("users", __name__, url_prefix="/users")
user_schema = UserSchema()
users_schema = UserSchema(many=True)


@bp.route("/", methods=["GET"])
@jwt_required()
def list_users():
    identity = get_jwt_identity()
    user_id = identity["id"] if isinstance(identity, dict) else identity
    current = User.query.get(user_id)
    if not current:
        return jsonify({"msg": "User not found"}), 404

    role_filter = request.args.get("role")

    # Admin or manager: return all users (optionally filtered by role)
    if current.role in ["admin", "manager"]:
        users = User.query.all()
        if role_filter:
            users = [u for u in users if u.role == role_filter]
        return jsonify(users_schema.dump(users)), 200

    # Clinic user: return only patients who have appointments at this clinic
    if current.role == "clinic":
        # clinic wants patients list: we ignore a client-sent role param and always return patients only
        # (keeps behaviour predictable for clinic UI)
        appts = Appointment.query.filter_by(clinic_id=current.id).all()
        if not appts:
            return jsonify([]), 200
        patient_ids = list({a.patient_id for a in appts if a.patient_id})
        if not patient_ids:
            return jsonify([]), 200
        patients = User.query.filter(User.id.in_(patient_ids)).all()
        return jsonify(users_schema.dump(patients)), 200

    # All other roles forbidden
    return jsonify({"msg": "Not authorized"}), 403


@bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    identity = get_jwt_identity()
    user_id_jwt = identity["id"] if isinstance(identity, dict) else identity
    current = User.query.get(user_id_jwt)
    if not current:
        return jsonify({"msg": "User not found"}), 404

    # Admin/manager can view any user
    if current.role in ["admin", "manager"]:
        user = User.query.get_or_404(user_id)
        return jsonify(user_schema.dump(user)), 200

    # Clinic may view a patient only if that patient has appointment at this clinic
    if current.role == "clinic":
        appt = Appointment.query.filter_by(clinic_id=current.id, patient_id=user_id).first()
        if not appt:
            return jsonify({"msg": "Not authorized"}), 403
        user = User.query.get_or_404(user_id)
        return jsonify(user_schema.dump(user)), 200

    # Standard user may view themself
    if current.id == user_id:
        user = User.query.get_or_404(user_id)
        return jsonify(user_schema.dump(user)), 200

    return jsonify({"msg": "Not authorized"}), 403


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
    return jsonify(user_schema.dump(user)), 200
