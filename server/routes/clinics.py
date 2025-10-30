from flask import Blueprint, jsonify, request
from models import Clinic, User
from schemas import ClinicSchema
from extensions import db
from flask_jwt_extended import create_access_token

bp = Blueprint("clinics", __name__, url_prefix="/clinics")

clinic_schema = ClinicSchema()
clinics_schema = ClinicSchema(many=True)

# ----------------------------
# List all clinics (optional limit)
# ----------------------------
@bp.route("/", methods=["GET"])
def list_clinics():
    q = Clinic.query
    limit = request.args.get("_limit", type=int)
    if limit:
        items = q.limit(limit).all()
    else:
        items = q.all()
    return jsonify(clinics_schema.dump(items))

# ----------------------------
# Get single clinic by ID
# ----------------------------
@bp.route("/<int:clinic_id>", methods=["GET"])
def get_clinic(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    return jsonify(clinic_schema.dump(clinic))

# ----------------------------
# Clinic login
# ----------------------------
@bp.route("/login", methods=["POST"])
def clinic_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Authenticate against the User table for role="clinic"
    user = User.query.filter_by(email=email, role="clinic").first()
    if not user:
        return jsonify({"message": "Clinic not found. Please log in as a clinic."}), 404

    if not user.check_password(password):
        return jsonify({"message": "Incorrect password"}), 401

    # Generate JWT token
    token = create_access_token(identity={"id": user.id, "role": user.role})

    return jsonify({
        "message": "Login successful",
        "token": token,
        "clinic": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "phone": user.phone_number
        }
    })
