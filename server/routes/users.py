# backend/routes/users.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User, Appointment
from schemas import UserSchema
import json

bp = Blueprint("users", __name__, url_prefix="/users")
user_schema = UserSchema()
users_schema = UserSchema(many=True)


@bp.route("/", methods=["GET"])
@jwt_required()
def list_users():
    identity = get_jwt_identity()
    user_id = int(identity) if isinstance(identity, str) else identity.get("id")
    current = User.query.get(user_id)
    if not current:
        return jsonify({"msg": "User not found"}), 404

    user_ids = request.args.getlist("id", type=int)
    role_filter = request.args.get("role")
    clinic_id = request.args.get("clinicId", type=int)

    q = User.query

    # PRIORITY 1: id=1&id=2 → ALLOW FOR CLINIC TOO
    if user_ids:
        q = q.filter(User.id.in_(user_ids))
        if role_filter:
            q = q.filter(User.role == role_filter)
        # ALLOW CLINIC TO FETCH PATIENTS BY ID
        if current.role == "clinic":
            pass  # Let it through
        elif current.role not in ["admin", "manager"]:
            return jsonify({"msg": "Not authorized"}), 403
        users = q.all()
        return jsonify(users_schema.dump(users)), 200

    # PRIORITY 2: Role-based filtering
    if current.role in ["admin", "manager"]:
        if role_filter:
            q = q.filter(User.role.ilike(role_filter))
        if clinic_id and role_filter == "doctor":
            q = q.join(Appointment, User.id == Appointment.doctor_id).filter(
                Appointment.clinic_id == clinic_id
            )
        elif clinic_id:
            q = q.join(Appointment, User.id == Appointment.patient_id).filter(
                Appointment.clinic_id == clinic_id
            )
    elif current.role == "clinic":
        appts = Appointment.query.filter_by(clinic_id=current.clinic_id).all()
        patient_ids = {a.patient_id for a in appts if a.patient_id}
        q = q.filter(User.id.in_(patient_ids))
    elif current.role == "doctor":
        appts = Appointment.query.filter_by(doctor_id=current.id).all()
        patient_ids = {a.patient_id for a in appts if a.patient_id}
        q = q.filter(User.id.in_(patient_ids))
    elif current.role == "patient":
        return jsonify([user_schema.dump(current)]), 200
    else:
        return jsonify({"msg": "Not authorized"}), 403

    users = q.distinct().all()
    return jsonify(users_schema.dump(users)), 200


@bp.route("/<int:user_id>", methods=["PATCH"])
@jwt_required()
def update_user(user_id):
    current_user = get_jwt_identity()
    user_id_from_token = (
        current_user.get("id") if isinstance(current_user, dict) else int(current_user)
    )

    current = User.query.get(user_id_from_token)
    if not current:
        return jsonify({"msg": "User not found"}), 404

    # Authorization checks
    if user_id_from_token != user_id and current.role not in ["admin", "clinic"]:
        return jsonify({"msg": "Unauthorized - insufficient role"}), 403
    if current.role == "clinic":
        if not current.clinic_id:
            return jsonify({"msg": "Clinic not linked to user"}), 400
        appt = Appointment.query.filter_by(
            clinic_id=current.clinic_id, patient_id=user_id
        ).first()
        if not appt:
            return (
                jsonify(
                    {
                        "msg": "Unauthorized - no appointment found for this patient at your clinic"
                    }
                ),
                403,
            )

    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    # Log payload for debugging
    print("PATCH /users Payload:", data)

    # Update fields
    if "fullName" in data:
        user.full_name = data["fullName"]
    if "phoneNumber" in data:
        user.phone_number = data["phoneNumber"]
    if "saved_clinics" in data:
        user.saved_clinics = data["saved_clinics"]
    if "profile" in data:
        if not isinstance(data["profile"], dict):
            return jsonify({"msg": "Profile must be a valid JSON object"}), 400
        current_profile = user.profile or {}
        if isinstance(current_profile, str):
            try:
                current_profile = json.loads(current_profile)
            except json.JSONDecodeError:
                current_profile = {}
        if not isinstance(current_profile, dict):
            current_profile = {}
        user.profile = {**current_profile, **data["profile"]}

    try:
        db.session.commit()
        print("User updated successfully:", user_id)
        return jsonify(user_schema.dump(user)), 200
    except Exception as e:
        db.session.rollback()
        print("Database error:", str(e))
        return jsonify({"msg": f"Database error: {str(e)}"}), 500
