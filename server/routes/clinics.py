from flask import Blueprint, request, jsonify
from extensions import db
from models import Clinic, User
from schemas import ClinicSchema
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from functools import wraps
import uuid

bp = Blueprint("clinics", __name__, url_prefix="/api/clinics")
clinic_schema = ClinicSchema()
clinic_list_schema = ClinicSchema(many=True)

# ---------------------------
# Decorators
# ---------------------------
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        if claims.get("role") != "admin":
            return jsonify({"msg": "Admins only"}), 403
        return fn(*args, **kwargs)
    return wrapper

# ---------------------------
# Routes
# ---------------------------

# GET all clinics (any logged-in user)
@bp.route("/", methods=["GET"])
def list_clinics():
    clinics = Clinic.query.all()
    return jsonify(clinic_list_schema.dump(clinics))

# GET single clinic by UUID (any logged-in user)
@bp.route("/<uuid:clinic_id>", methods=["GET"])
def get_clinic(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    return jsonify(clinic_schema.dump(clinic))

# Toggle save clinic for a user (any logged-in user)
@bp.route("/<uuid:clinic_id>/save", methods=["POST"])
@jwt_required()
def toggle_save_clinic(clinic_id):
    uid = get_jwt_identity()
    user = User.query.get(uid)
    clinic = Clinic.query.get_or_404(clinic_id)
    if clinic in user.saved_clinics:
        user.saved_clinics.remove(clinic)
        db.session.commit()
        return jsonify({"msg": "Clinic removed from saved list"})
    else:
        user.saved_clinics.append(clinic)
        db.session.commit()
        return jsonify({"msg": "Clinic saved"})

# Create a new clinic (admin only)
@bp.route("/", methods=["POST"])
@admin_required
def create_clinic():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400
    try:
        clinic = clinic_schema.load(json_data, session=db.session)
    except Exception as e:
        return jsonify({"msg": "Validation error", "errors": str(e)}), 400

    db.session.add(clinic)
    db.session.commit()
    return jsonify(clinic_schema.dump(clinic)), 201

# Update clinic (admin only)
@bp.route("/<uuid:clinic_id>", methods=["PUT"])
@admin_required
def update_clinic(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400
    try:
        updated_clinic = clinic_schema.load(json_data, instance=clinic, session=db.session)
    except Exception as e:
        return jsonify({"msg": "Validation error", "errors": str(e)}), 400

    db.session.commit()
    return jsonify(clinic_schema.dump(updated_clinic)), 200

# Delete clinic (admin only)
@bp.route("/<uuid:clinic_id>", methods=["DELETE"])
@admin_required
def delete_clinic(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    db.session.delete(clinic)
    db.session.commit()
    return jsonify({"msg": "Clinic deleted"}), 200
