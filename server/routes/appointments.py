# routes/appointments.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Appointment, User, Role, Clinic
from schemas import AppointmentSchema

bp = Blueprint("appointments", __name__, url_prefix="/appointments")
appt_schema = AppointmentSchema()
appts_schema = AppointmentSchema(many=True)


# List Appointments
@bp.route("/", methods=["GET"])
@jwt_required()
def list_appointments():
    user_id = int(get_jwt_identity())
    current_user = User.query.get(user_id)
    if not current_user:
        return jsonify({"msg": "User not found"}), 404

    patient_q = request.args.get("patientId", type=int)
    query = Appointment.query

    if current_user.role in [Role.ADMIN, Role.MANAGER]:
        if patient_q:
            query = query.filter_by(patient_id=patient_q)
    elif current_user.role == Role.CLINIC:
        if not current_user.clinic_id:
            return jsonify({"msg": "Clinic not linked to user"}), 400
        query = query.filter_by(clinic_id=current_user.clinic_id)
        if patient_q:
            query = query.filter_by(patient_id=patient_q)
    else:  # Patient
        if patient_q and patient_q != current_user.id:
            return jsonify({"msg": "Not authorized"}), 403
        query = query.filter_by(patient_id=current_user.id)

    appts = query.all()
    results = []
    for appt in appts:
        patient = User.query.get(appt.patient_id)
        appt_dict = appt_schema.dump(appt)
        appt_dict["patientName"] = patient.full_name if patient else "Unknown"
        results.append(appt_dict)

    return jsonify(results)


# Create Appointment
@bp.route("/", methods=["POST"])
@jwt_required()
def create_appointment():
    user_id = int(get_jwt_identity())  # ← int
    data = request.get_json() or {}
    required = ["clinicId", "date", "time"]
    for r in required:
        if r not in data:
            return jsonify({"msg": f"Missing field {r}"}), 400

    clinic_id = data.get("clinicId")
    if not clinic_id or not isinstance(clinic_id, int):
        return jsonify({"msg": "Invalid clinicId"}), 400

    # Validate clinic exists
    if not Clinic.query.get(clinic_id):
        return jsonify({"msg": "Clinic not found"}), 404

    appt = Appointment(
        patient_id=user_id,
        clinic_id=clinic_id,
        clinic_name=data.get("clinicName"),
        doctor=data.get("doctor"),
        service=data.get("service"),
        date=data.get("date"),
        time=data.get("time"),
        status=data.get("status", "Pending"),
        notes=data.get("notes"),
    )
    db.session.add(appt)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to save appointment"}), 500

    appt_dict = appt_schema.dump(appt)
    patient = User.query.get(appt.patient_id)
    appt_dict["patientName"] = patient.full_name if patient else "Unknown"

    return jsonify(appt_dict), 201


# Get Single Appointment
@bp.route("/<int:appt_id>", methods=["GET"])
@jwt_required()
def get_appointment(appt_id):
    user_id = int(get_jwt_identity())
    current_user = User.query.get(user_id)
    appt = Appointment.query.get_or_404(appt_id)

    if current_user.role in [Role.ADMIN, Role.MANAGER]:
        pass
    elif current_user.role == Role.CLINIC:
        if appt.clinic_id != current_user.clinic_id:
            return jsonify({"msg": "Not authorized"}), 403
    else:
        if appt.patient_id != current_user.id:
            return jsonify({"msg": "Not authorized"}), 403

    appt_dict = appt_schema.dump(appt)
    patient = User.query.get(appt.patient_id)
    appt_dict["patientName"] = patient.full_name if patient else "Unknown"

    return jsonify(appt_dict)


# Update Appointment Status
@bp.route("/<int:appt_id>", methods=["PATCH"])
@jwt_required()
def update_appointment(appt_id):
    user_id = int(get_jwt_identity())
    current_user = User.query.get(user_id)
    if not current_user:
        return jsonify({"msg": "User not found"}), 404

    appt = Appointment.query.get_or_404(appt_id)

    if current_user.role not in [Role.ADMIN, Role.MANAGER, Role.CLINIC]:
        return jsonify({"msg": "Not authorized"}), 403
    if current_user.role == Role.CLINIC and appt.clinic_id != current_user.clinic_id:
        return jsonify({"msg": "Not authorized"}), 403

    data = request.get_json() or {}
    status = data.get("status")
    if not status:
        return jsonify({"msg": "Missing status"}), 400

    allowed_statuses = ["Pending", "Confirmed", "Completed", "Cancelled"]
    if status not in allowed_statuses:
        return jsonify({"msg": f"Invalid status '{status}'"}), 400

    appt.status = status
    db.session.commit()

    appt_dict = appt_schema.dump(appt)
    patient = User.query.get(appt.patient_id)
    appt_dict["patientName"] = patient.full_name if patient else "Unknown"

    return jsonify(appt_dict), 200
