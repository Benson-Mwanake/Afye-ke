from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Appointment, Clinic, User
from schemas import AppointmentSchema

bp = Blueprint("appointments", __name__, url_prefix="/appointments")
appt_schema = AppointmentSchema()
appts_schema = AppointmentSchema(many=True)

@bp.route("/", methods=["GET"])
@jwt_required()
def list_appointments():
    identity = get_jwt_identity()
    user_id = identity["id"] if isinstance(identity, dict) else identity
    patient_q = request.args.get("patientId", type=int)
    if patient_q:
        current_user = User.query.get(user_id)
        if current_user.role != "admin" and current_user.id != patient_q:
            return jsonify({"msg": "Not authorized"}), 403
        appts = Appointment.query.filter_by(patient_id=patient_q).all()
    else:
        appts = Appointment.query.filter_by(patient_id=user_id).all()

    return jsonify(appts_schema.dump(appts))


@bp.route("/", methods=["POST"])
@jwt_required()
def create_appointment():
    identity = get_jwt_identity()
    user_id = identity["id"] if isinstance(identity, dict) else identity
    data = request.get_json() or {}
    required = ["clinicId", "date", "time"]
    for r in required:
        if r not in data:
            return jsonify({"msg": f"Missing field {r}"}), 400

    appt = Appointment(
        patient_id=user_id,
        clinic_id=data.get("clinicId"),
        clinic_name=data.get("clinicName"),
        doctor=data.get("doctor"),
        service=data.get("service"),
        date=data.get("date"),
        time=data.get("time"),
        status=data.get("status", "Pending"),
        notes=data.get("notes"),
    )
    db.session.add(appt)
    db.session.commit()
    return jsonify(appt_schema.dump(appt)), 201


@bp.route("/<int:appt_id>", methods=["GET"])
@jwt_required()
def get_appointment(appt_id):
    user_id = get_jwt_identity()
    appt = Appointment.query.get_or_404(appt_id)
    current_user = User.query.get(user_id)
    if current_user.role != "admin" and appt.patient_id != user_id:
        return jsonify({"msg": "Not authorized"}), 403
    return jsonify(appt_schema.dump(appt))
