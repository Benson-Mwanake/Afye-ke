from flask import Blueprint, request, jsonify
from extensions import db
from models import Booking, User
from schemas import BookingSchema
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from functools import wraps
import uuid

bp = Blueprint("bookings", __name__, url_prefix="/api/appointments")
booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)

# ---------------------------
# Decorators
# ---------------------------
def admin_or_clinic_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        claims = get_jwt()
        role = claims.get("role")
        if role not in ["admin", "clinic"]:
            return jsonify({"msg": "Admins or clinics only"}), 403
        return fn(*args, **kwargs)
    return wrapper

# ---------------------------
# Routes
# ---------------------------

# Get all bookings
@bp.route("/", methods=["GET"])
@jwt_required()
def get_bookings():
    claims = get_jwt()
    role = claims.get("role")
    user_id = get_jwt_identity()

    if role == "admin":
        # Admin sees all bookings
        bookings = Booking.query.all()
    elif role == "clinic":
        # Clinic sees only their clinic's bookings
        bookings = Booking.query.filter_by(clinic_id=user_id).all()
    else:
        # Normal patients cannot access this route
        return jsonify({"msg": "Access denied"}), 403

    return jsonify(bookings_schema.dump(bookings)), 200

# Create new booking (patient only)
@bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        claims = get_jwt()
        role = claims.get("role")

        if role != "patient":
            return jsonify({"msg": "Only patients can create bookings"}), 403

        # Ensure required fields exist
        if not data.get("clinic_id") or not data.get("clinic_name"):
            return jsonify({"msg": "Missing clinic_id or clinic_name"}), 400

        booking = Booking(
            patient_id=user_id,
            clinic_id=data.get("clinic_id"),
            clinic_name=data.get("clinic_name"),
            doctor=data.get("doctor"),
            service=data.get("service"),
            date=data.get("date"),
            time=data.get("time"),
            status=data.get("status", "Pending"),
            notes=data.get("notes"),
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify(booking_schema.dump(booking)), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Server error", "error": str(e)}), 500

# Get bookings for logged-in patient
@bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_bookings():
    user_id = get_jwt_identity()
    claims = get_jwt()
    role = claims.get("role")

    if role != "patient":
        return jsonify({"msg": "Only patients can view their own bookings"}), 403

    my_bookings = Booking.query.filter_by(patient_id=user_id).all()
    return jsonify(bookings_schema.dump(my_bookings)), 200

# Get a single booking by ID
@bp.route("/<uuid:booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    claims = get_jwt()
    role = claims.get("role")
    user_id = get_jwt_identity()

    # Only admin, clinic (of the booking), or the patient can access
    if role == "admin" or (role == "clinic" and booking.clinic_id == user_id) or (role == "patient" and booking.patient_id == user_id):
        return jsonify(booking_schema.dump(booking)), 200
    return jsonify({"msg": "Access denied"}), 403

# Update booking (admin or clinic only)
@bp.route("/<uuid:booking_id>", methods=["PUT"])
@admin_or_clinic_required
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    claims = get_jwt()
    role = claims.get("role")
    user_id = get_jwt_identity()

    # Clinics can only update their own bookings
    if role == "clinic" and booking.clinic_id != user_id:
        return jsonify({"msg": "Access denied"}), 403

    data = request.get_json()
    for field in ["status", "doctor", "service", "date", "time", "notes", "clinic_name"]:
        if field in data:
            setattr(booking, field, data[field])

    db.session.commit()
    return jsonify(booking_schema.dump(booking)), 200

# Delete booking (admin or clinic only)
@bp.route("/<uuid:booking_id>", methods=["DELETE"])
@admin_or_clinic_required
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    claims = get_jwt()
    role = claims.get("role")
    user_id = get_jwt_identity()

    # Clinics can only delete their own bookings
    if role == "clinic" and booking.clinic_id != user_id:
        return jsonify({"msg": "Access denied"}), 403

    db.session.delete(booking)
    db.session.commit()
    return jsonify({"msg": "Booking deleted"}), 200
