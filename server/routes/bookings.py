from flask import Blueprint, request, jsonify
from extensions import db
from models import Booking, User, Clinic
from schemas import BookingSchema
from marshmallow import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("bookings", __name__, url_prefix="/api/appointments")

booking_schema = BookingSchema(session=db.session)
booking_list_schema = BookingSchema(many=True, session=db.session)

@bp.route("/", methods=["GET"])
@jwt_required()
def list_bookings():
    bookings = Booking.query.all()
    return jsonify(booking_list_schema.dump(bookings))

@bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"msg": "No input provided"}), 400

    try:
        data = booking_schema.load(json_data, session=db.session)
    except ValidationError as ve:
        return jsonify({"msg": "Validation error", "errors": ve.messages}), 400

    booking = Booking(**data)
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking_schema.dump(booking)), 201
