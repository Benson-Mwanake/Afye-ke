from flask import Blueprint, request, jsonify
from extensions import db
from models import Booking, Clinic, User
from schemas import BookingSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")

# Use session=db.session to avoid "Deserialization requires a session" error
booking_schema = BookingSchema(session=db.session)
booking_list_schema = BookingSchema(many=True, session=db.session)

@bp.route("/", methods=["GET"])
@jwt_required()
def list_bookings():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if user.role == "admin":
        bookings = Booking.query.all()
    else:
        bookings = Booking.query.filter_by(user_id=uid).all()
    result = booking_list_schema.dump(bookings)
    return jsonify(result)

@bp.route("/<int:booking_id>", methods=["GET"])
@jwt_required()
def get_booking(booking_id):
    uid = get_jwt_identity()
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != uid and User.query.get(uid).role != "admin":
        return jsonify({"msg": "Not authorized to view this booking"}), 403
    result = booking_schema.dump(booking)
    return jsonify(result)

@bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    uid = get_jwt_identity()
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400

    try:
        data = booking_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400
    except ValueError as ve:
        return jsonify({"msg": str(ve)}), 400

    clinic = Clinic.query.get(data.clinic_id)
    if not clinic:
        return jsonify({"msg": "Clinic not found"}), 404

    booking = Booking(
        user_id=uid,
        clinic_id=data.clinic_id,
        appointment_time=data.appointment_time,
        status=data.status or "pending",
        notes=data.notes
    )
    db.session.add(booking)
    db.session.commit()

    result = booking_schema.dump(booking)
    return jsonify(result), 201

@bp.route("/<int:booking_id>", methods=["PUT"])
@jwt_required()
def update_booking(booking_id):
    uid = get_jwt_identity()
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != uid and User.query.get(uid).role != "admin":
        return jsonify({"msg": "Not authorized to update this booking"}), 403

    json_data = request.get_json()
    try:
        data = booking_schema.load(json_data, partial=True, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400
    except ValueError as ve:
        return jsonify({"msg": str(ve)}), 400

    # allowed updates
    if "appointment_time" in json_data:
        booking.appointment_time = data.appointment_time
    if "status" in json_data:
        booking.status = data.status
    if "notes" in json_data:
        booking.notes = data.notes

    db.session.commit()
    result = booking_schema.dump(booking)
    return jsonify(result)

@bp.route("/<int:booking_id>", methods=["DELETE"])
@jwt_required()
def delete_booking(booking_id):
    uid = get_jwt_identity()
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != uid and User.query.get(uid).role != "admin":
        return jsonify({"msg": "Not authorized to delete this booking"}), 403
    db.session.delete(booking)
    db.session.commit()
    return jsonify({"msg": "Booking deleted"})
